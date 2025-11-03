function(C, A) // cmd:"cmd"
{	
	const L = #fs.scripts.lib()

		function debug(info, text){
			var time = ("000" + (Date.now()-_ST)).slice(-4)
			#D("(debug) `K|` "+time+"`Ams` `K|` `3[`"+info+"`3]` `K|` "+text)
		}



	var HOW_TO_USE = ""+
		"Database Management Script [v2.0.0]"+
		"\n"+
		"\nScript Arguments:"+
		"\n#`Ncmd`:"+
		"\n╠`V\"find\"` `v[f]` - Finds an object in the database"+
		"\n║ #`Nquery`: optional `V<{`obj`V}>` (default:{})"+
		"\n║ #`Nmethod`: (default:\"array\")"+
		"\n║ ╠`V\"first\"` `v[f]` - Returns the first matching document"+
		"\n║ ║ #`Nprojection`: optional `V<{`obj`V}>`"+
		"\n║ ║ #`Nskip`: optional `V<`int`V>` (default:0)"+
		"\n║ ║ #`Nsort`: optional `V<{`obj`V}>`"+
		"\n║ ║"+
		"\n║ ╠`V\"array\"` `v[a]` - Returns all matching documents"+
		"\n║ ║ #`Nprojection`: optional `V<{`obj`V}>`"+
		"\n║ ║ #`Nskip`: optional `V<`int`V>` (default:0)"+
		"\n║ ║ #`Nlimit`: optional `V<`int`V>` (default:10)"+
		"\n║ ║ #`Nsort`: optional `V<{`obj`V}>`"+
		"\n║ ║"+
		"\n║ ╠`V\"count\"` `v[c]` - Returns the number of matching documents"+
		"\n║ ║"+
		"\n║ ╚`V\"distinct\"` `v[d]` - Returns an array of all unique values found for matching keys"+
		"\n║   #`Nkey`:`V<\"`property`V\">`"+
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
		"\n║ #`Nquery`: `V<{`obj`V}>`"+
		"\n║ #`Nupdate`: `V<{`obj or obj containing MongoDB update operator`V}>`"+
		"\n║ #`Nconfirm`: `Vtrue`"+
		"\n║"+
		"\n╠`V\"update1\"` `v[u1]` - Updates a single document in the database."+
		"\n║ #`Nquery`: `V<{`obj`V}>`"+
		"\n║ #`Nupdate`: `V<{`obj or obj containing MongoDB update operator`V}>`"+
		"\n║ #`Nconfirm`: `Vtrue`"+
		"\n║"+
		"\n╠`V\"updateS\"` `v[us]` - Updates documents in the database, if they exist. Inserts the document if it does not exist"+
		"\n║ #`Nquery`: `V<{`obj`V}>`"+
		"\n║ #`Nupdate`: `V<{`obj or obj containing MongoDB update operator`V}>`"+
		"\n║ #`Nconfirm`: `Vtrue`"+
		"\n║"+
		"\n╠`V\"specifications\"` `v[specs]` - Specifications of the database"+
		"\n║"+
		"\n║`V\"nuke\"` `w(DO NOT USE)` - Deletes everything in the database \\(T^T)/"+
		"\n╚ #`Nconfirm`:`Vtrue`"+
		"\n Dependencies: `E#fs.scripts.lib()`"



	function findDistinct(){
		if(!A.key){
			return{ok:false, msg:"Invalid `Nkey`."}
		}

		return #db.f(A.query).distinct(A.key)
	}

	function findArray(skip, limit, sort){
		return #db.f(A.query, A.projection).skip(skip).limit(limit).sort(sort).array()
	}
		
	function find(){
		var skip = 0
		var limit = 10
		var sort = {}
		var query = {}

		if(L.is_obj(A.query)){
			query = A.query
		}

		if(L.is_num(A.skip)){
			skip = A.skip
		}

		if(L.is_num(A.limit)){
			limit = A.limit
		}
		
		if(L.is_obj(A.sort) && A.sort != {}){
			sort = A.sort
		}

		if(!A.method){
			return findArray(skip, limit, sort)
		}

		switch(A.method){
			case "first":
			case "f":
				return #db.f(A.query, A.projection).skip(skip).sort(sort).first()

			case "array":
			case "a":
				return findArray(skip, limit, sort)

			case "count":
			case "c":
				return #db.f(A.query).count()

			case "distinct":
			case "d":
				return findDistinct()
			
			default:
				return {ok:false, msg:"Invalid `Nmethod`."}
		}
	}



	function insert(){
		if(!L.is_obj(A.doc)){
			return {ok:false, msg:"Invalid `Ndoc`."}
		}

		if(!A.confirm === true){
			return {ok:false, msg:"Operation not `Nconfirm``ned`."}
		}

		return #db.i(A.doc)

	}



	function remove(){
		if(!L.is_obj(A.query) || A.query == {}){
			return {ok:false, msg:"Invalid `Nquery`."}
		}

		if(!A.confirm === true){
			return {ok:false, msg:"Operation not `Nconfirm``ned`."}
		}

		return #db.r(A.query)
	}



	function update(type){
		if(!L.is_obj(A.query) || A.query == {}){
			return {ok:false, msg:"Invalid `Nquery`."}
		}

		if(!L.is_obj(A.update)){
			return {ok:false, msg:"Invalid `Nupdate`."}
		}

		if(!A.confirm === true){
			return {ok:false, msg:"Operation not `Nconfirm``ned`."}
		}

		switch(type){
			case "normal":
				return #db.u(A.query, A.update)

			case "one":
				return #db.u(A.query, A.update)

			case "upsert":
				return #db.u(A.query, A.update)
			
			default:
				return {ok: false, msg:"Invalid update type."}
		}
	}



	function specifications(){
		var specifications = {
			n_documents: #db.f({}).count(),
			collections: #db.f({}).distinct("collection")
		}

		specifications.collections.forEach((element, index, array) => {
			array[index] = {
				name: element,
				n_documents: #db.f({collection: element}).count()
			}
		})

		return specifications
	}



	function nuke(){
		if(!A.confirm === true){
			return {ok:false, msg:"Operation not `Nconfirm``ned`."}
		}

		if(A.security_message !== "Delete everything in my database"){
			var warning = "- You are about to `Ddelete ALL documents`!\n"+
			"- I you know what you are doing type:\nsecurity_message: \"Delete everything in my database\""

			return {ok:false, msg:warning}
		}

		return #db.r({})
	}



	//function help(pag){
	//	return {ok:false, msg:"Not implemented yet."}
	//}

	
	
	function commands(){
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
				return update("normal")

			case "update1":
			case "u1":
				return update("one")

			case "updateS":
			case "uS":
				return update("upsert")
			
			case "specifications":
			case "specs":
				return specifications()

			case "nuke":
				return nuke()

			default: 
				return {ok:false, msg:"Invalid `Ncmd`"}
		}
	}
	


	// Order of execution and debug text ----------------------------------------------------------------------------
	try{
		if((!A) || A == {}){
			return HOW_TO_USE
		}

		return commands()

	}catch(e){
		#D(e)
		throw e
	}
}
