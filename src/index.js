import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection,onSnapshot,
  addDoc, deleteDoc, doc,
  query, where, orderBy, serverTimestamp, getDoc, updateDoc
} from 'firebase/firestore'
import {
    getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged
} from  'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAh2reIgN41xwPzobpP8Eeo09b_9m0Jzns",
    authDomain: "scorechecker-e0770.firebaseapp.com",
    projectId: "scorechecker-e0770",
    storageBucket: "scorechecker-e0770.appspot.com",
    messagingSenderId: "829108869952",
    appId: "1:829108869952:web:ba4240327152b837a2b8a5"
  }

 // init firebase
initializeApp(firebaseConfig)

// init services
const db = getFirestore()
const auth = getAuth()
const L1List = document.querySelector('.playersList');
const L2List = document.querySelector('.clubList');
const L3List = document.querySelector('.teeList');

// collection ref

const colRef = collection(db, 'courses')
const colPlayers = collection(db, 'players')
const getClub = localStorage.getItem("club")
document.getElementById("selClub").innerHTML = getClub;


const c = query(colPlayers, where ("club", "==", getClub));
const q = query(colRef,  orderBy('course'));
const t = query(colRef,  where ("course", "==", getClub));
// realtime collection data

  const setupL1 = (data) => {
    document.getElementById("selPlayers").style.display='block';
    document.getElementById("selClubs").style.display='none';
    document.getElementById("selTees").style.display='none';
    if (data.length) {
      let html = '';
      data.forEach(doc => {
        const l1 = doc.data();
        
        const li = `
          <tr><td id="pname">${l1.name}</td><td id="pwhs">${l1.whs}</td></tr>
        `;
      html += li;
      });
      L1List.innerHTML = html
    }
  };

  const setupL2 = (data) => {
    document.getElementById("selPlayers").style.display='none';
    document.getElementById("selClubs").style.display='block';
    document.getElementById("selTees").style.display='none';
    if (data.length) {
      let html = '';
      data.forEach(doc => {
        const l2 = doc.data();
        const l2i = `
          <tr><td>${l2.course}</td></tr>
        `;
      html += l2i;
      });
      L2List.innerHTML = html
    }
  };

  const setupL3 = (data) => {
    document.getElementById("selPlayers").style.display='none';
    document.getElementById("selClubs").style.display='none';
    document.getElementById("selTees").style.display='block';
    if (data.length) {
      let html = '';
      data.forEach(doc => {
        const l3 = doc.data();
        const l3i = `
          <tr><td>White<td class="slp">${l3.white}</td></tr>
          <tr><td>Yellow<td class="slp">${l3.yellow}</td></tr>
          <tr><td>Green<td class="slp">${l3.green}</td></tr>
          <tr><td>Red<td class="slp">${l3.red}</td></tr>
          <tr><td colspan="2" style="color: red; text-align:center">Amend  &#x2216; Add course slopes at: </td></tr>
          <tr><td colspan="2" style="color: red; text-align:center"> "Menu -> Courses"</td></tr>
        `;
      html += l3i;
      });
      L3List.innerHTML = html
    }
   
  };
  onSnapshot(c, (snapshot) => {
    let players = []
    snapshot.docs.forEach(doc => {
        players.push({ ...doc.data(), id: doc.id })
    })
    setupL1(snapshot.docs);
   
  })
  onSnapshot(q, (snapshot) => {
    let courses = []
    snapshot.docs.forEach(doc => {
        courses.push({ ...doc.data(), id: doc.id })
    })
    setupL2(snapshot.docs);
  })
  onSnapshot(t, (snapshot) => {
    let tees = []
    snapshot.docs.forEach(doc => {
        tees.push({ ...doc.data(), id: doc.id })
    })
    setupL3(snapshot.docs);
  })
  
  let whsHcp = []
  const pwhs = localStorage.getItem("player");
  const hcp = query(colPlayers, where ("name", "==", pwhs));
  onSnapshot(hcp, (snapshot) => {
    let playershcp = []
    snapshot.docs.forEach(doc => {
      playershcp.push({ ...doc.data(), id: doc.id })
      playershcp = doc.data();
      whsHcp = playershcp.whs;
    }) 
  })
  
 
// adding docs
const addCourseForm = document.querySelector('.add')
addCourseForm.addEventListener('submit', (e) => {
  e.preventDefault()

  addDoc(colRef, {
    course: addCourseForm.course.value,
    town: addCourseForm.town.value,
    createdAt: serverTimestamp()
  })
  .then(() => {
    addCourseForm.reset()
  })
})

// deleting docs
const deleteCourseForm = document.querySelector('.delete')
deleteCourseForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'courses', deleteCourseForm.id.value)

  deleteDoc(docRef)
    .then(() => {
        deleteCourseForm.reset()
    })
})
// updating a document
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
  e.preventDefault()

  let docRef = doc(db, 'courses', updateForm.id.value)

  updateDoc(docRef, {
    course: 'The Grove'
  })
  .then(() => {
    updateForm.reset()
  })
})
// signing users up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  createUserWithEmailAndPassword(auth, email, password)
    .then(cred => {
      console.log('user created:', cred.user)
      signupForm.reset()
    })
    .catch(err => {
      console.log(err.message)
    })
})
// logging in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      //console.log('user signed out')
    })
    .catch(err => {
      console.log(err.message)
    })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password)
    .then(cred => {
      //console.log('user logged in:', cred.user)
      loginForm.reset()
    })
    .catch(err => {
      console.log(err.message)
    })
})

  
