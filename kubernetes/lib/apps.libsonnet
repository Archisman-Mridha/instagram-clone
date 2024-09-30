local Utils = import './utils.libsonnet';

local app = 'apps';

{
  root: Utils.argoCDApp(name='root', destinationNamespace='argocd'),
}
