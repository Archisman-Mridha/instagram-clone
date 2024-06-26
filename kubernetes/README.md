# Managing physical users (Authentication and Authorization)

Let's say, our database engineering team consists of 1 person - Adam.

Adam will first generate a private key.
```sh
mkdir -p users/adam && \
  openssl genrsa -out ./users/adam/private-key 2048
```

Then he will create the Certificate Signing Request (CSR) -
```sh
openssl req \
  -new \
  -key ./users/adam/private-key \
  -out ./users/adam/csr \
  -subj "/CN=adam"

# View the CSR
openssl req -in ./users/adam/csr -noout -text

# Base64 encoding the CSR
cat ./users/adam/csr | base64 | tr -d "\n"
```

He will then share the base 64 encoded CSR with me (the cluster admin 😎). Using that, I will create
a `Kubernetes CSR object` based on this template - *./certificate-signing-request.yaml*. I will then
approve the CSR using this command :-
```sh
kubernetes certificate approve <csr-name>
```
A Certificate will be generated by the Kubernetes Certificate Authority. The certificate is stored
in the status.certificate field of the CSR object. We can obtain it using this command -
```sh
kubectl get csr adam -o jsonpath='{.status.certificate}'| base64 -d > ./users/adam/certificate
```

I will then share the Kubernetes CSR object defintion file and the Certificate with Adam. Adam can
then modify his ~/.kube/config file using this command -
```sh
# Adding the user
kubectl config set-credentials adam \
	--client-key=./users/adam/private-key --client-certificate=./users/adam/certificate \
	--embed-certs=true

# Creating the context adn using that.
kubectl config set-context adam --cluster=main --user=adam && \
  kubectl config use-context adam
```

Hooraaayyyy, Adam is now a part of the Kubernetes team !!

Now, the Certificate has an expiration time. Let's give Adam permission to create (but not get) the
CSR by himself.
```sh
# Create the ClusterRole and ClusterRoleBinding.
kubectl apply -f ./users/physical-user.yaml && \
  kubectl apply -f ./users/adam/physical-users.cluster-role-binding.yaml
```
So from next time, he can also create the Kubernetes CSR object. I just need to approve it and share
the generated Certificate with him.

Now, I will define the permissions for a database engineer using a Kubernetes `Role` and then bind
the Role with Adam.
```sh
# Create the database namespace
kubectl create namespace databases

# Create the Role and RoleBinding.
kubectl apply -f ./users/database-engineer.yaml && \
  kubectl apply -f ./users/adam/database-engineer.role-binding.yaml
```