import{ initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc, 
    query,where,
    orderBy, serverTimestamp,
    getDoc
} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAZw_7AKuS8ikrOsmlSAdJJxowddWSotns",
    authDomain: "first-9bfc4.firebaseapp.com",
    projectId: "first-9bfc4",
    storageBucket: "first-9bfc4.appspot.com",
    messagingSenderId: "228392219980",
    appId: "1:228392219980:web:52d56687450fdec89f0be9",
    measurementId: "G-7TR8D4P8JY"
}

initializeApp(firebaseConfig) //starts the firebase config in the web app

const db=getFirestore()  //for getting the entire firebase database

const colRef= collection(db,'books') //refernce to a collection in the database called 'books'

//querry
// const q=query(colRef,where("author","==","Patrick R."),orderBy('title','desc')) //descending arrange by title
const q=query(colRef,orderBy('createdAt'))

//onsnapshot funtion is used for gettin the live/real time database updates and log that into the console
//it is bascially a real-time listener or subscription to firestore collection(in this case='books')
onSnapshot(q,(snapshot)=>{  //taking a snashot (state of an event) of the entire collection   
    let books=[] //creating the books array for storing the collection items within
    snapshot.docs.forEach((doc) => {
        books.push({...doc.data() ,id: doc.id})
    })
    console.log(books)
})


    const addBookForm = document.querySelector('.add')  //using DOM elements for getting the element with .add class
    addBookForm.addEventListener('submit',(e)=>{    //eventlistener when event='submit'
        e.preventDefault() //prevents the default html action,i.e., refresing a page when button is clicked

        addDoc(colRef,{                   //add dock function is asynchronous which allows us to add a new element to the collection 
            title: addBookForm.title.value,  //works similar to dom structure 
            author: addBookForm.author.value,
            createdAt: serverTimestamp()

        })
        .then(()=>{
            addBookForm.reset()  //as it is async func., we can perform then function after it has been completed
        })
    })

    const deleteBookForm = document.querySelector('.delete') //for deleting the document
    deleteBookForm.addEventListener('submit',(e)=>{
        e.preventDefault()
        const docRef=doc(db,'books',deleteBookForm.id.value)
        deleteDoc(docRef)
            .then(()=>{
                deleteBookForm.reset()
            })
    })

    //get a single Document
    const docRef= doc(db,'books','cjVUNBppvOFekN7eJYKl')
    // getDoc(docRef)  //returns a promise where we can use a then function
    //     .then((doc)=>{
    //         console.log(doc.data(),doc.id)
    //     })
//setting up a real-time listener to the single document
onSnapshot(docRef, (doc) => {
    console.log(doc.data(),doc.id)
}) //subscribes whenever a document is changed(documnet properties are changed)