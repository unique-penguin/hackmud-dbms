# hackmud-dbms
A Free and Open Source Database Management Script (FODBMS) for hackmud.

<img width="1241" height="787" alt="image" src="https://github.com/user-attachments/assets/ceba97f7-a7cd-4091-a5c6-5490ee9fb2a6" />

## Main Freatures
- All find methods, `first, array, count, distinct` and all their parameters, `query, projection, skip, limit, sort` (some methods arent compatible with some parameters by disign);
- Insert single or multiple docuemnts (asks for confirmation);
- Removes sngle or multiple documents (asks for confirmation), but doesn't allow for the complete deletion of the database (use nuke for that);
- All ways to update documents, `update, update only 1, update with upsert` (asks for confirmation);
- Easy way to see the specifications/geral info of the database. (Requires the documents to have a `collection` property);
- A way to delete everything in the database with double confirmation, first normal and security message;
- Arguemnts market with `*` can be omitted, because they can be ignored or have default values assigned;

## Extra Info
- `Char Count: 4308` -> `Objective: 2000`;
- Readable code, with little nesting;
- No external dependencies;
- Error and TypeError checking for all arguments;
- Script protection to only run if user is allowed, needs to be uncommented.

## Tips
- If you don't have enougth chars you can replace the varible `HELP` with an empty string and use the image.

## Initial Investors
- Bowkill
- Shira
