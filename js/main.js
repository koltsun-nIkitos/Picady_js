
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyD9OY14m7snDkd2NlEgocruw-MyPCxPBw0",
  authDomain: "pikaba-4b751.firebaseapp.com",
  projectId: "pikaba-4b751",
  storageBucket: "pikaba-4b751.appspot.com",
  messagingSenderId: "258654854687",
  appId: "1:258654854687:web:ab0223abc3aacd1681ff2a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);



"use strict";


const menuToggle = document.querySelector('#menu-toggle');
const menu = document.querySelector('.sidebar');

const regExpValidEmail = /^[a-zA-Z0-9._-]+@\w+\.\w{2,}$/;

const loginElem = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const emailInput = document.querySelector('.login-email');
const passwordInput = document.querySelector('.login-password');
const loginSignup = document.querySelector('.login-signup');
const loginForget = document.querySelector('.login-forget');

const userElem = document.querySelector(".user");
const userNameElem = document.querySelector(".user-name");

const exitElem = document.querySelector('.exit');
const editElem = document.querySelector('.edit');
const editContainer = document.querySelector('.edit-container');


const editUsername = document.querySelector('.edit-username');
const editPhotoURL = document.querySelector('.edit-photo');
const userAvatarElem = document.querySelector('.user-avatar');
const postWrapper = document.querySelector('.posts');

const buttonNewPost = document.querySelector('.button-new-post');
const addPostElem = document.querySelector(".add-post");

const DEFAULT_PHOTO = userAvatarElem.src;

const setUsers = {
  user: null,
  initUser(handler){
    firebase.auth().onAuthStateChanged(user => {
      if (user){
        this.user = user;
      } else{
        this.user = null;
      }

      if(handler){
        handler();
      }
    })
  },

  logIn(email, password, handler) {
    if (!regExpValidEmail.test(email)) {
      alert("E-mail не валиден");
      return;
    } 

    firebase.auth().signInWithEmailAndPassword(email, password)
    .catch((err)=>{
      const errCode = err.code;
      const errMessage = err.message;
      if (errCode === 'auth/wrong-password'){
        console.log(errMessage);
        alert('Неверный пароль');
      } else if(errCode === 'auth/user-not-found'){
        console.log(errMessage);
        alert("Пользователь не найден");
      }else{
        alert(errMessage);
      }

      console.log(err);
    })


  },

  logOut() {
    firebase.auth().signOut();
  },

  signUp(email, password, handler) {
    if (!regExpValidEmail.test(email)) {
      alert("E-mail не валиден");
      return;
    } 

    if (!email.trim() || !password.trim()){
      alert('Введите данные');
      return
    }

    firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(data=>{
        this.editUser(email.substring(0, email.indexOf('@'), null, handler))
      })
      .catch((err)=>{
        const errCode = err.code;
        const errMessage = err.message;
        if (errCode === 'auth/weak-password'){
          console.log(errMessage);
          alert('Слабый пароль');
        } else if(errCode === 'auth/email-already-in-use'){
          console.log(errMessage);
          alert("Это email уже используется");
        }else{
          alert(errMessage);
        }

        console.log(err);
      });

  },

  editUser(displayName, photoURL, handler){

    const user = firebase.auth().currentUser;

    if (displayName){
      if(photoURL){
        user.updateProfile({
          displayName,
          photoURL
        }).then(handler)
      } else{
        user.updateProfile({
          displayName
        }).then(handler)
      }
    }
  },


  sendForget(email){
    firebase.auth().sendPasswordResetEmail(email)
      .then(()=>{
        alert('Письмо отправлено!');
      })
      .catch(err => {
        console.log(err);
      })
  }

};

const setPosts = {
  AllPosts: [],

  addPost(title, text, tags, handler){
    const user = firebase.auth().currentUser;

    this.AllPosts.unshift({
      id: `postID${(+new Date().toString(16))}-${user.uid}`,
      title,
      text,
      tags: tags.split(',').map(item => item.trim()),
      author:{
        displayName: setUsers.user.displayName,
        photo: setUsers.user.photoURL,
      },
      date: new Date().toLocaleString(navigator.language, 
        {
          day: '2-digit', 
          month:'2-digit', 
          year:'numeric', 
          hour: '2-digit', 
          minute:'2-digit'
        }
      ),
      likes: 0,
      comments: 0,
    });

    firebase.database().ref('post').set(this.AllPosts)
      .then(()=> this.getPosts(handler));

  },

  getPosts(handeler){
    firebase.database().ref('post').on('value', snapshort =>{
      this.AllPosts = snapshort.val() || [];
      handeler();
    })
  },


};

const toogleAuthDom = ()=>{
  const user = setUsers.user;

  if (user){
    loginElem.style.display = 'none';
    userElem.style.display = '';
    userNameElem.textContent = user.displayName;
    userAvatarElem.src = user.photoURL || DEFAULT_PHOTO;
    buttonNewPost.classList.add('visible');
  }else{
    loginElem.style.display = '';
    userElem.style.display = 'none';
    buttonNewPost.classList.remove('visible');
    addPostElem.classList.remove('visible');
    postWrapper.classList.add('visible');

  };
}

const showAddPost = ()=>{
  addPostElem.classList.add('visible');
  postWrapper.classList.remove('visible');
};

const showAllPosts= () =>{

  let postsHTML = '';

  setPosts.AllPosts.forEach((post) =>{
    const {title, text, date, author, tags, likes, comments} = post;
    const paragraphs = text.split('\n');
    let checkedTags = '';
    
    if (tags[0]==''){
      checkedTags = '';
    }else{
      checkedTags = tags.map(tag => `<a href="#${tag}" class="tag">#${tag}</a>`).join("");
    }
  

    postsHTML += `
    <section class="post">
      <div class="post-body">
        <h2 class="post-title">${title}</h2>
        ${paragraphs.map(paragraph => `<p class="post-text">${paragraph}</p>`).join('')}


        <div class="tags">
          ${checkedTags}
        </div>
        <!-- /.tags -->
      </div>
      <!-- /.post-body -->

      <div class="post-footer">
        <div class="post-buttons">
          <button class="post-button likes">
            <svg width="19" height="20" class="icon icon-like">
              <use xlink:href="img/icons.svg#like"></use>
            </svg>
            <span class="likes-counter">${likes}</span>
          </button>
          <button class="post-button comments">
            <svg width="21" height="21" class="icon icon-comment">
              <use xlink:href="img/icons.svg#comment"></use>
            </svg>
            <span class="comments-counter">${comments}</span>
          </button>
          <button class="post-button save">
            <svg width="19" height="19" class="icon icon-save">
              <use xlink:href="img/icons.svg#save"></use>
            </svg>
          </button>
          <button class="post-button share">
            <svg width="17" height="19" class="icon icon-share">
              <use xlink:href="img/icons.svg#share"></use>
            </svg>
          </button>
        </div>
        <!-- /.post-buttons -->
        <div class="post-author">
          <div class="author-about">
            <a href="#" class="author-username">${author.displayName}</a>
            <span class="post-time">${date}</span>
          </div>
          <a href="#" class="author-link">
            <img 
              style="object-fit: cover;" src="${author.photo || "../img/avatar.jpeg" }" alt="avatar" class="author-avatar">
            </a>
        </div>
        <!-- /.post-author -->
      </div>
      <!-- /.post-footer -->
    </section>
    `

  });

  postWrapper.innerHTML = postsHTML;

  addPostElem.classList.remove('visible');
  postWrapper.classList.add('visible');
}


const init = () =>{

  menuToggle.addEventListener('click', function (event) {
    event.preventDefault();
    menu.classList.toggle('visible');
  })


  toogleAuthDom();
  showAllPosts();

  loginForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    const emailValue = emailInput.value;
    const passwordValue = passwordInput.value;
  
    setUsers.logIn(emailValue, passwordValue, toogleAuthDom);
    loginForm.reset(); 
  });
  
  loginSignup.addEventListener('click', event =>{
    event.preventDefault();
    const emailValue = emailInput.value;
    const passwordValue = passwordInput.value;
  
    setUsers.signUp(emailValue, passwordValue, toogleAuthDom);
    loginForm.reset();
  });

  loginForget.addEventListener('click', event =>{
    event.preventDefault();
  
    setUsers.sendForget(emailInput.value);
    emailInput.value = '';
  });  
  
  exitElem.addEventListener('click', event=>{
    event.preventDefault();
    setUsers.logOut();
  });
  
  editElem.addEventListener('click', (event)=>{
    event.preventDefault();
    editUsername.value = setUsers.user.displayName;
    editContainer.classList.toggle('visible');
  });
  
  
  editContainer.addEventListener('submit', (event)=>{
    event.preventDefault();
  
    setUsers.editUser(editUsername.value, editPhotoURL.value, toogleAuthDom);
    editContainer.classList.remove('visible');
  })

  buttonNewPost.addEventListener('click', (event)=>{
    event.preventDefault();
    showAddPost();
  });

  addPostElem.addEventListener('submit', (event)=>{
    event.preventDefault();
    const { title, text, tags } = addPostElem.elements;
    if (title.value.length < 6){
      alert('Слишком короткий заголовок');
      return;
    }
    if(text.value.length < 50){
      alert("Слишком короткий пост");
      return;
    }

    setPosts.addPost(title.value, text.value, tags.value, showAllPosts);

    addPostElem.classList.remove('visible');
    addPostElem.reset();
  });

  setUsers.initUser(toogleAuthDom);
  setPosts.getPosts(showAllPosts)
  showAllPosts();

}

document.addEventListener('DOMContentLoaded', init());