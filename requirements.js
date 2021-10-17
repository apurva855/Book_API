REQUIREMENTS.JS

//Requirement for our project

//We are a book management company

//BOOKS
//ISBN, title, pub date, language, num page, author[], category[]

//AUTHORS
//id, name, books[]

//PUBLICATIONS
//id, name, books[]

//We have to design and code an API over this .

//1. BOOKS
//We need an API :-
//To get all the books - DONE
//To get specific book - DONE
//To get a list of books based on category - DONE
//To get a list of books based on languages - DONE

//2. AUTHORS
//We need an API :-
//To get all the authors - DONE
//To get a specific author based on id- YOUR  DONE
//To get a list of authors based on books - DONE

//3. PUBLICATIONS
//We need an API :-
//To get all the publications
//To get a specific publication - DONE
//To get a list of publications based on a book - YOUR TASK


//POST request
//1.ADD NEW BOOKS - DONE
//2 ADD NEW PUBLICATION
//3 ADD NEW AUTHOR

/* DELETE*/
//update book detailes if author is changed
//delete author from book
//delete author from book and related from author

//SCHEMA- IS BLUEPRINT OF HOW THE DATA HAS TO BE CONTRUCTED
//mongodb is schemaless but mongoose has schema
//mongoose validation, check relationship with other data
//model - document model of mongodb
//schema- model-user then

//mongodb operators -> powerful

//logical operators

//$ins ->increament , -1, -2, -3
//$min -> minimum


//$max ->maximum


//$set -> used to set a data
//book.title ="xyz"

//$unset-> removing property from a media-object
//book={title:"hello"};

//ARRAY OPERATORS
//$push ->element will be push to end of the array
//name=["apurva" ,"mahajan"]

//$pop ->used to extract/remove/delte the last element

//$pull->
/*pull:{
name:"xyz"
}*/

//$addToSet->it same as push but it does not allow duplicates
