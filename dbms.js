function(C, A) // cmd:"cmd"
{	
	var confirm = {ok:false, msg:"Confirm with confirm:true"}

	var HELP = "`HDatabase Management Script [v2.0.0]`\n"+
		"\nScript Arguments:"+
		"\n#`Ncmd`:"+
		"\n╠`V\"find\"` `v[f]` - Finds a/multiple document(s) in the database"+
		"\n║ #*`Nquery`: `V<{`obj`V}>` (default:{})"+
		"\n║ #*`Nmethod`: (default:\"array\")"+
		"\n║ ╠`V\"first\"` `v[f]` - Returns the first matching document"+
		"\n║ ║ #*`Nprojection`: `V<{`obj`V}>`"+
		"\n║ ║ #*`Nskip`: `V<`int`V>`"+
		"\n║ ║ #*`Nsort`: `V<{`obj`V}>`"+
		"\n║ ║"+
		"\n║ ╠`V\"array\"` `v[a]` - Returns an array of all matching documents"+
		"\n║ ║ #*`Nprojection`: `V<{`obj`V}>`"+
		"\n║ ║ #*`Nskip`: `V<`int`V>`"+
		"\n║ ║ #*`Nlimit`: `V<`int`V>` (default:10)"+
		"\n║ ║ #*`Nsort`: `V<{`obj`V}>`"+
		"\n║ ║"+
		"\n║ ╠`V\"count\"` `v[c]` - Returns the number of matching documents"+
		"\n║ ║"+
		"\n║ ╚`V\"distinct\"` `v[d]` - Returns an array of all unique values found for matching keys"+
		"\n║   #`Nkey`:`V<\"`property as str`V\">`"+
		"\n║"+
		"\n╠`V\"insert\"` `v[i]` - Adds to the database"+
		"\n║ #`Ndoc`: `V<{`obj`V}>` or `V<[`arr of objs`V]>`"+
		"\n║ #`Nconfirm`: `Vtrue`"+
		"\n║"+
		"\n╠`V\"remove\"` `v[r]` - Removes document(s) from the database"+
		"\n║ #`Nquery`: `V<{`obj`V}>`"+
		"\n║ #`Nconfirm`: `Vtrue`"+
		"\n║"+
		"\n╠`V\"update\"` `v[u]` - Updates documents in the database"+
		"\n╠`V\"update1\"` `v[u1]` - Updates a single document in the database"+
		"\n╠`V\"updateS\"` `v[uS]` - Updates documents in the database, if they exist. Inserts the document if it doesn't exist"+
		"\n║ #`Nquery`: `V<{`obj`V}>`"+
		"\n║ #`Nupdate`: `V<{`obj/MongoDB obj`V}>`"+
		"\n║ #`Nconfirm`: `Vtrue`"+
		"\n║"+
		"\n╠`V\"specifications\"` `v[specs]`"+
		"\n║"+
		"\n║`V\"nuke\"` `w(CAUTION)` - Deletes everything in the database \\(T^T)/"+
		"\n╚ #`Nconfirm`:`Vtrue`\n"+
		"\n`A(* - optional)`"



	function isObj(x){
		return (typeof x === 'object' && !Array.isArray(x) && x !== null)
	}

	function isInt(x){
		return Number.isInteger(x)
	}

	function objSize(x){
		return Object.keys(x).length
	}

	

	function find(){
		if(!A.query){
			A.query = {}
		}
		
		if(!isObj(A.query)){
			throw new TypeError ("Invalid query")
		}

		if(!A.skip){
			A.skip = 0
		}

		if(!isInt(A.skip)){
			throw new TypeError("Invalid skip")
		}

		if(!A.limit){
			A.limit = 10
		}

		if(!isInt(A.limit)){
			throw new TypeError("Invalid limit")
		}

		if(!A.sort){
			A.sort = {}
		}
		
		if(!isObj(A.sort)){
			throw new TypeError("Invalid sort")
		}

		if(!A.method){
			A.method = "a"
		}

		switch(A.method){
			case "first":
			case "f":
				return #db.f(A.query, A.projection).skip(A.skip).sort(A.sort).first()

			case "array":
			case "a":
				return #db.f(A.query, A.projection).skip(A.skip).limit(A.limit).sort(A.sort).array()

			case "count":
			case "c":
				return #db.f(A.query).count()

			case "distinct":
			case "d":
				if(!A.key){
					throw new Error("Missing key")
				}

				if(typeof A.key !== 'string'){
					throw new TypeError("Invalid key")
				}

				return #db.f(A.query).distinct(A.key)

			default:
				throw new Error("Invalid method");
		}
	}



	function insert(){
		if(!A.doc){
			throw new Error("Missing doc")
		}

		if(!isObj(A.doc)){
			throw new TypeError("Invalid doc")
		}

		if(!A.confirm === true){
			return confirm
		}

		return #db.i(A.doc)
	}



	function remove(){
		if(!A.query){
			throw new Error ("Missing query")
		}

		if(!isObj(A.query)){
			throw new TypeError ("Invalid query")
		}

		if(objSize(A.query) === 0){
			return {ok:false, msg:"To delete everything use cmd:\"nuke\""}
		}

		if(!A.confirm === true){
			return confirm
		}

		return #db.r(A.query)
	}



	function update(type){
		if(!A.query){
			throw new Error ("Missing query")
		}

		if(!isObj(A.query)){
			throw new TypeError ("Invalid query")
		}

		if(!A.update){
			throw new Error("Missing update")
		}

		if(!isObj(A.update)){
			throw new TypeError("Invalid update")
		}

		if(!A.confirm === true){
			return confirm
		}

		switch(type){
			case "n":
				return #db.u(A.query, A.update)

			case "o":
				return #db.u1(A.query, A.update)

			case "u":
				return #db.us(A.query, A.update)
		}
	}



	function specs(){
		var specs = {
			n_documents: #db.f({}).count(),
			collections: #db.f({}).distinct("collection")
		}

		specs.collections.forEach((e, i, a) => {
			a[i] = {
				name: e,
				n_documents: #db.f({collection: e}).count()
			}
		})

		return specs
	}



	function nuke(){
		if(!A.confirm === true){
			return confirm
		}

		if(A.security_message !== "Delete everything in my database"){
			return {ok:false, msg:"- You are about to `Ddelete ALL documents`!\n- If you know what you are doing type:\nsecurity_message: \"Delete everything in my database\""}
		}

		return #db.r({})
	}
	
	
	
	function commands(){
		if(!A.cmd){
			throw new Error("Missing cmd")
		}

		switch(A.cmd){
			case "find":
			case "f":
				return find()
			
			case "insert":
			case "i":
				return insert()

			case "remove":
			case "r":
				return remove()

			case "update":
			case "u":
				return update("n")

			case "update1":
			case "u1":
				return update("o")

			case "updateS":
			case "uS":
				return update("u")
			
			case "specifications":
			case "specs":
				return specs()

			case "nuke":
				return nuke()

			default:
				throw new Error ("Invalid cmd")
		}
	}
	


	// Order of execution ----------------------------------------------------------------------------
	try{
		if((!A)){
			return HELP
		}

		return commands()

	}catch(e){
		return "`D"+e+"`"
	}
}
