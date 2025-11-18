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
- `Char Count: 4260` -> `Objective: 2000`;
- Replacing variable `HELP` with and empty string reduces the `char count to 2769`, for the one with few chars while we work to reduce the size;
- Readable code, with little nesting;
- No external dependencies;
- Error and TypeError checking for all arguments.

### Initial Investors
- Bowkill
- Shira
