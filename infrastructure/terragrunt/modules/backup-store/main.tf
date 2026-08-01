resource "aws_s3_bucket" "backup_store" {
  bucket           = "backups.${var.environment}.openmedia"
  bucket_namespace = "account-regional"
}

/*
  Regarding encryption at rest :

    Amazon S3 now applies server-side encryption with Amazon S3 managed keys (SSE-S3) as the base
    level of encryption for every bucket in Amazon S3. Starting January 5, 2023, all new object
    uploads to Amazon S3 are automatically encrypted at no additional cost and with no impact on
    performance.
    
    When you use server-side encryption, Amazon S3 encrypts an object before saving it to disk and
    decrypts it when you download the object.
    
    Starting April 2026, Amazon S3 automatically disables server-side encryption with
    customer-provided keys (SSE-C) for all new general purpose buckets. Amazon S3 also disabled
    SSE-C for existing buckets in accounts with no SSE-C encrypted objects. This means that by
    default, requests to upload objects using SSE-C are rejected with an HTTP 403 AccessDenied
    error.
*/

// You can use S3 Versioning to keep multiple versions of an object in one bucket.
resource "aws_s3_bucket_versioning" "backup_store" {
  bucket = aws_s3_bucket.backup_store.id

  versioning_configuration {
    status = "Enabled"
  }
}

/*
  // S3 Object Lock can help prevent Amazon S3 objects from being deleted or overwritten for a fixed
  // amount of time or indefinitely. Object Lock uses a write-once-read-many (WORM) model to store
  // objects.
  // Object Lock works only in buckets that have S3 Versioning enabled. When you lock an object
  // version, Amazon S3 stores the lock information in the metadata for that object version. Placing
  // a retention period or a legal hold on an object protects only the version that's specified in
  // the request. Retention periods and legal holds don't prevent new versions of the object from
  // being created, or delete markers to be added on top of the object.
  // If you put an object into a bucket that already contains an existing protected object with the
  // same object key name, Amazon S3 creates a new version of that object. The existing protected
  // version of the object remains locked according to its retention configuration.
  resource "aws_s3_bucket_object_lock_configuration" "backup_store" {
    bucket = aws_s3_bucket.backup_store.id

    rule {
      // A retention period protects an object version for a fixed amount of time. When you place a
      // retention period on an object version, Amazon S3 stores a timestamp in the object version's
      // metadata to indicate when the retention period expires. After the retention period expires,
      // the object version can be overwritten or deleted.
      // You can place a retention period explicitly on an individual object version or on a bucket's
      // properties so that it applies to all objects in the bucket automatically.
      default_retention {
        // In compliance mode, a protected object version can't be overwritten or deleted by any user,
        // including the root user in your AWS account. When an object is locked in compliance mode,
        // its retention mode can't be changed, and its retention period can't be shortened.
        // Compliance mode helps ensure that an object version can't be overwritten or deleted for
        // the duration of the retention period.
        mode = "COMPLIANCE"

        days = local.backup_object_lock_days
      }
    }
  }
*/

// Each object in Amazon S3 has a storage class associated with it. By default, objects in S3 are
// stored in the S3 Standard storage class, however Amazon S3 offers a range of other storage
// classes for the objects that you store. You choose a class depending on your use case scenario
// and performance access requirements. Choosing a storage class designed for your use case lets
// you optimize storage costs, performance, and availability for your objects. All of these storage
// classes offer high durability.
//
// You can specify a storage class for an object when you upload it. If you don't, Amazon S3 uses
// the default Amazon S3 Standard storage class for objects in general purpose buckets. You can
// also change the storage class of an object that's already stored in an Amazon S3 general purpose
// bucket to any other storage class.
//
// You can direct Amazon S3 to change the storage class of objects automatically by adding an S3
// Lifecycle configuration to a bucket.
// S3 Lifecycle helps you store objects cost effectively throughout their lifecycle by transitioning
// them to lower-cost storage classes, or, deleting expired objects on your behalf.

resource "aws_s3_bucket_lifecycle_configuration" "velero_backups" {
  bucket = aws_s3_bucket.backup_store.id

  rule {
    id     = "velero-backups"
    status = "Enabled"

    filter {
      prefix = "velero/"
    }

    /*
      Initially, I wanted to upload a Velero backup to S3 Standard storage class. Then, after a
      week, transition it to S3 Standard IA storage class. Finally, after a month, expire it. But
      because of the following constraints, I've decided to directly put the backup objects in the
      S3 Standard IA storage class.

        (1) Objects must be stored for at least 30 days before transitioning to S3 Standard-IA or
            S3 One Zone-IA.

        (2) You are charged for transitioning objects before their minimum storage duration.
    */

    // Expire a Velero backup after 30 days.

    /*
      When an object reaches the end of its lifetime based on its lifecycle configuration, Amazon
      S3 takes an Expiration action based on which S3 Versioning state the bucket is in:

        Versioning-enabled bucket - If the current object version is not a delete marker, Amazon
        S3 adds a delete marker with a unique version ID. This makes the current version noncurrent,
        and the delete marker the current version.
    */
    expiration {
      days = local.velero_backup_object_lock_days
    }
    // You can use the NoncurrentVersionExpiration action element to direct Amazon S3 to
    // permanently delete noncurrent versions of objects.
    noncurrent_version_expiration {
      noncurrent_days = local.velero_backup_object_lock_days
    }
  }
}

// TODO : Consider other types of backups, and the S3 lifecycle policies required for them.
