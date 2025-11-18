# hackmud-dbms
A Free and Open Source Database Management Script (FODBMS) for hackmud.

<img width="1239" height="783" alt="imagem" src="https://github.com/user-attachments/assets/8c36047c-ef09-48cf-9711-ed10984a3444" />

## Main Features
- All find methods, `first, array, count, distinct` and all their parameters, `query, projection, skip, limit, sort` (some methods aren't compatible with some parameters by design);
- Insert single or multiple documents (asks for confirmation);
- Removes single or multiple documents (asks for confirmation), but doesn't allow for the complete deletion of the database (use nuke for that);
- All functions to update documents, `update, update only 1, update with upsert` (asks for confirmation);
- Easy way to see the number of documents of the database by collection. (Requires the documents to have a `collection` property);
- A way to delete everything in the database with double confirmation, first normal and security message;
- Arguments market with `*` can be omitted, because they can be ignored or have default values assigned;
- Letters between `[]` represent aliases for `cmds`;
- Script protection to only run if the user is allowed, needs to be uncommented;

## Extra Info
- `Char Count: 4308` -> `Objective: 2000`;
- Readable code, with little nesting;
- No external dependencies;
- Error and TypeError checking for all arguments;

## Tips
- If you don't have enough chars you can replace the variable `HELP` with an empty string and use the image above as a guide;

## Initial Investors
- bowkill
- shira
