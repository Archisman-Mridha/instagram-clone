-- name: GetUnpublishedMessages :many
WITH selected_rows AS (
  SELECT id FROM outbox
    WHERE locked=FALSE AND published=FALSE
    LIMIT @batch_size
      FOR UPDATE SKIP LOCKED
)
  UPDATE outbox
    SET locked=TRUE, locked_on=CURRENT_TIMESTAMP
      WHERE (id) IN (SELECT id from selected_rows)
        RETURNING id, message;

-- name: UnlockMessagesFailedTobePublished :exec
UPDATE outbox
  SET locked=FALSE, locked_on=NULL
    WHERE id = @id;

-- name: DeleteRowsWithPublishedMessages :exec
DELETE FROM outbox
  WHERE published=TRUE;

-- name: InsertMessage :exec
INSERT INTO outbox
  (message)
    VALUES (@message);