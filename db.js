function(C, A) // cmd:"cmd"
{	
	// --------------------------------------------------------------------------------------------------------------
	// |Oraganization of the Database
	// |	Directory 			(dir)
	// |		SubDirectory 	(subdir)
	// |			Document 	(doc)
	// |-------------------------------------------------------------------------------------------------------------
	// | Script Arguments
	// |	- cmd (command):
	// |		- add				
	// |			- costum: true
	// |				- doc
	// |				- confirm: true/false
	// |			- costum: false
	// |				- source: market
	// |					- query
	// |				- source: inventory
	// |		- remove			
	// |			- query
	// |				- confirm: true/false
	// |		- update			
	// |			- query
	// |				- update
	// |					- confirm: true/false
	// |		- show				
	// |			- query
	// |		- specifications	
	// --------------------------------------------------------------------------------------------------------------
	// | Information
	// | 	Each add-source should have a unique function
	// |		- This is needed for speed, trying to make a function to work with multiple 
	// |		cases can make this very slow, so formatToDB and addToDB need to be joined together(?)
	// |		and make unique for each source type.
	// | 		
	// | 		

	const L = #fs.scripts.lib()

		function log(info, text){
			var time = ("000" + (Date.now()-_ST)).slice(-4)
			L.log("`K|` "+time+"`Ams` `K|` `3[`"+info+"`3]` `K|` "+text)
		}

		function debug(info, text){
			var time = ("000" + (Date.now()-_ST)).slice(-4)
			#D("(debug) `K|` "+time+"`Ams` `K|` `3[`"+info+"`3]` `K|` "+text)
		}

	function specsInfo(){
		var dir_arr = #db.f({}).distinct("dir")
		var specs = {
			n_documents: #db.f({}).count() // number of documents
		}
		
		for(let i in dir_arr){
			var subdir_arr = #db.f({dir: dir_arr[i]}).distinct("subdir")

			specs[dir_arr[i]] = {total: #db.f({dir: dir_arr[i]}).count()}

			for(let e in subdir_arr){
				specs[dir_arr[i]][subdir_arr[e]] = #db.f({dir: dir_arr[i], subdir: subdir_arr[e]}).count()
			}
		}
		
		// Expected Result
		//{
		//	n_documents: 100
		//	raw_data:{
		//		total: 100
		//		upgrade: 50
		//		loc: 50
		//	}
		//}

		return specs
	}



	var HOW_TO_USE = ""+
		"Database Management [v2.0.0]"+
		"\n"+
		"\nScript Arguments:"+
		"\n#`Ncmd`:"+
		"\n╠`V\"find\"` `v[f]` - Finds an object in the database"+
		"\n║ #`Nquery`: `V<{`obj`V}>`"+
		"\n║ #`Nmethod`:"+
		"\n║ ╠`V\"first\"` `v[f]` - Returns the first matching document"+
		"\n║ ║ #`Nprojection`: optional `V<{`obj`V}>`"+
		"\n║ ║ #`Nskip`: optional `V<`int`V>` (defualt:0)"+
		"\n║ ║ #`Nsort`: optional `V<{`obj`V}>`"+
		"\n║ ║"+
		"\n║ ╠`V\"array\"` `v[a]` - Returns all matching documents"+
		"\n║ ║ #`Nprojection`: optional `V<{`obj`V}>`"+
		"\n║ ║ #`Nskip`: optional `V<`int`V>` (defualt:0)"+
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
		"\n╠`V\"remove\"` `v[rm/r]` - Removes document(s) from the database"+
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
		"\n╠`V\"specifications\"` `v[specs/sp]` - Specifications of the database"+
		"\n║"+
		"\n║`V\"nuke\"` `w(DO NOT USE)` - Deletes everything in the database \\(º^º)/"+
		"\n╚ #`Nconfirm`:`Vtrue`"+
		"\n"+
		"\n#`N\help\`: `V<`pag`V>`/0 - Not Implemented"


	function findDistinct(){
		if(!A.key){
			return{ok:false, msg:"Invalid `Nkey`."}
		}

		return #db.f(A.query).distinct(A.key)
	}

	function findArray(skip, limit, sort){
		#db.f(A.query, A.projection).skip(skip).limit(limit).sort(sort).array()
	}
		
	function find(){
		var skip = 0
		var limit = 10
		var sort = {}

		if(!L.is_obj(A.query)){
			return {ok:false, msg:"Invalid `Nquery`"}
		}

		if(!A.method){
			return findArray(skip, limit, sort)
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



	function nuke(){
		if(!A.confirm === true){
			return {ok:false, msg:"Operation not `Nconfirm``ned`."}
		}

		if(!A.security_message === "Delete everything in my database"){
			var warning = "- You are about to `Ddelete ALL documents`!\n- I you know what you are doing type:\nsecurity_message: \"Delete everything in my database\""
			return {ok:false, msg:warning}
		}

		return #db.r({})
	}



	function help(pag){
		return {ok:false, msg:"Not implemented yet."}
	}

	
	
	function commands(){
		switch(A.cmd){
			case "find":
			case "f":
				return find()
			
			case "insert":
			case "i":
				return insert()

			case "remove":
			case "rm":
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
			case "sp":
				return specsInfo()

			case "nuke":
				return nuke()

			default: 
				return {ok:false, msg:"Invalid `Ncmd`"}
		}
	}
	


	// Order of execution and debug text ----------------------------------------------------------------------------
	try{

		if(!A || A == {}){
			return HOW_TO_USE
		}
		if(L.is_num(A.help)){
			return help(A.help)
		}

		return commands()

	}catch(e){
		#D(e)
		throw e
	}
}
