import{ initializeApp } from 'firebase/app'

import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc, 
    query,where,
    orderBy, serverTimestamp,
    getDoc,updateDoc,getDocs
} from 'firebase/firestore'

import{
    getAuth, createUserWithEmailAndPassword,
    signOut,signInWithEmailAndPassword,
    onAuthStateChanged
}from 'firebase/auth'

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
const auth=getAuth()

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
        .catch((err)=>{  //for catching any error
            console.log(err.message)
            alert("Error!")
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
            .catch((err)=>{  //for catching any error
                console.log(err.message)
                alert("No Such file Found!")
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

const updateForm= document.querySelector('.update')
updateForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const docRef=doc(db,'books',updateForm.id.value)
    updateDoc(docRef,{     //takes a doc referrence and an object which may or may not have all the properties of the original collection
        title: updateForm.new.value
    })
    .then(()=>{
        updateForm.reset()
    })
    .catch((err)=>{  //for catching any error
        console.log(err.message)
        alert("No Such file Found!")
    })
})

const li= document.querySelector('.tlist')
li.addEventListener('submit',(e)=>{
    e.preventDefault()
    getDocs(colRef)
    .then((snapshot)=>{
        let books=[]
        snapshot.docs.forEach((doc)=>{
            books.push({...doc.data() ,id: doc.id})
        })
        for(var i=0;i<books.length;i++)
        {
            alert(books[i].title)
        }
    })
})
const lim= document.querySelector('.alist')
lim.addEventListener('submit',(e)=>{
    e.preventDefault()
    getDocs(colRef)
    .then((snapshot)=>{
        let books=[]
        snapshot.docs.forEach((doc)=>{
            books.push({...doc.data(),id: doc.id})
        })
        for(var i=0;i<books.length;i++)
        {
            alert(books[i].author)
        }
    })
})
const lm = document.querySelector('.ilist')
lm.addEventListener('submit',(e)=>{
    e.preventDefault()
    getDocs(colRef)
    .then((snapshot)=>{
        let books=[]
        snapshot.docs.forEach((doc)=>{
            books.push({...doc.data(),id: doc.id})
        })
        for(var i=0;i<books.length;i++)
        {
            alert(books[i].id)
        }
    })
})

const signin=document.querySelector('.signin')  //for new user
signin.addEventListener('submit',(e)=>{
    e.preventDefault()
    const email=signin.email.value
    const pass=signin.password.value

    createUserWithEmailAndPassword(auth,email,pass)
    .then((cred)=>{
        alert("User Created:",cred.user)
        //console.log(cred.user)
        signin.reset()
    })
    .catch((err)=>{
        alert(err.message)
    })
})

const login=document.querySelector('.login')  //for existing login
login.addEventListener('submit',(e)=>{
    e.preventDefault()

    const email=login.email.value
    const pass=login.password.value

    signInWithEmailAndPassword(auth,email,pass)
    .then((cred)=>{
        //console.log("user logged in:",cred.user)
        alert("Logged in:",cred.user)
    })
    .catch((err)=>{
        console.log(err.message)
        alert('Something went wrong! Check Logs')
    })
})

const logout=document.querySelector('.logout') //for logout
logout.addEventListener('click',()=>{
    signOut(auth)
    .then(()=>{
        alert("Signed out Successfully!")
    })
    .catch((err)=>{
        console.log(err.message)
        alert('Something went wrong! Check Logs')
    })
})

onAuthStateChanged(auth,(user)=>{
    console.log("User Status Changed:",user)
})