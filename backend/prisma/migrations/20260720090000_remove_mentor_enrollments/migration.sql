-- Mentors no longer participate in learning paths as mentees. Clean up
-- enrollments created before this rule was enforced in the application.
UPDATE "Enrollment" AS enrollment
SET
  "status" = 'DROPPED',
  "isDeleted" = true
FROM "User" AS app_user
INNER JOIN "Role" AS user_role ON user_role."id" = app_user."roleId"
WHERE enrollment."userId" = app_user."id"
  AND user_role."name" = 'MENTOR'
  AND enrollment."isDeleted" = false;
