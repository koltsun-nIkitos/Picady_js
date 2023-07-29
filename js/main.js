"use strict";


// import validator from './validate.js';
const menuToggle = document.querySelector('#menu-toggle');
const menu = document.querySelector('.sidebar');

const regExpValidEmail = /^\w+@\w+\.\w{2,}$/;

const loginElem = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const emailInput = document.querySelector('.login-email');
const passwordInput = document.querySelector('.login-password');
const loginSignup = document.querySelector('.login-signup');

const userElem = document.querySelector(".user");
const userNameElem = document.querySelector(".user-name");

const exitElem = document.querySelector('.exit');
const editElem = document.querySelector('.edit');
const editContainer = document.querySelector('.edit-container');


const editUsername = document.querySelector('.edit-username');
const editPhotoURL = document.querySelector('.edit-photo');
const userAvatarElem = document.querySelector('.user-avatar');
const postWrapper = document.querySelector('.posts');


const listUsers = [
  {
    id: '01',
    email : "kolstunnv@yandex.ru",
    password: '12345',
    displayName: "KoltsNik",
    photo: 'https://sun9-21.userapi.com/impg/M6AQsOxaGSAhBiG5R3uTCJnERw9zEjkjnIOUAw/ro2cKreea04.jpg?size=1543x2160&quality=95&sign=3b231c08ae27ed1eda704de120b1b1d3&type=album'
  },
  {
    id: '02',
    email : "kate@yandex.ru",
    password: '123456',
    displayName: "katyParry",
    photo: 'https://lyrictum.com/wp-content/uploads/2021/09/katy-perry-15.jpg',
  }
];

const setUsers = {
  user: null,

  logIn(email, password, handler) {
    if (!regExpValidEmail.test(email)) {
      alert("E-mail не валиден");
      return;
    } 
    const user = this.getUser(email);

    if (user && user.password === password){
      this.authorizedUser(user);
      handler();
    } else{
      alert('Пользователь с такими данными не найден')
    }
  },

  logOut(handler) {
    this.user = null;
    handler();
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

    if (!this.getUser(email)){
      const user = { email, password, displayName: email.substring(0, email.indexOf('@')) }
      listUsers.push(user);
      this.authorizedUser(user);
      handler();
    }else{
      alert('Пользователь с таким именем уже зарегистрирован')
    }
  },

  editUser(userName, userPhoto='', handler){
    if (userName){
      this.user.displayName = userName;
    }

    if(userPhoto){
      this.user.photo = userPhoto;
    }

    handler();
  },

  getUser(email){
    return listUsers.find(item => item.email === email)
  },

  authorizedUser(user){
    this.user = user;
  }
};

const setPosts = {
  AllPosts: [
    {
      title: 'Плохо, когда одинаковые посты, набирают разные лайки',
      text: 'Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Языком что рот маленький реторический вершину текстов обеспечивает гор свой назад решила сбить маленькая дорогу жизни рукопись ему букв деревни предложения, ручеек залетают продолжил парадигматическая? Но языком сих пустился, запятой своего его снова решила меня вопроса моей своих пояс коварный, власти диких правилами напоивший они текстов ipsum первую подпоясал? Лучше, щеке подпоясал приставка большого курсивных на берегу своего? Злых, составитель агентство что вопроса ведущими о решила одна алфавит!',
      tags: ['свежее', 'новое', 'горячее', 'мое', 'случайность'],
      author: 'Katty Parry',
      date: '29.07.2023, 15:31',
      likes: 6507,
      comments: 226,
    },
    {
      title: 'Плохо, когда одинаковые посты, набирают разные лайки',
      text: 'Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Языком что рот маленький реторический вершину текстов обеспечивает гор свой назад решила сбить маленькая дорогу жизни рукопись ему букв деревни предложения, ручеек залетают продолжил парадигматическая? Но языком сих пустился, запятой своего его снова решила меня вопроса моей своих пояс коварный, власти диких правилами напоивший они текстов ipsum первую подпоясал? Лучше, щеке подпоясал приставка большого курсивных на берегу своего? Злых, составитель агентство что вопроса ведущими о решила одна алфавит!',
      tags: ['свежее', 'новое', 'горячее', 'мое', 'случайность'],
      author: 'KoltsNik',
      date: '29.07.2023, 16:45',
      likes: 45,
      comments: 2,
    },
    
  ],
};

const toogleAuthDom = ()=>{
  const user = setUsers.user;

  if (user){
    loginElem.style.display = 'none';
    userElem.style.display = '';
    userNameElem.textContent = user.displayName;
    userAvatarElem.src = user.photo || userAvatarElem.src;
  }else{
    loginElem.style.display = '';
    userElem.style.display = 'none';
  };
}




const showAllPosts= () =>{
  let postsHTML = '';

  setPosts.AllPosts.forEach((post) =>{
    const {title, text, date, author, tags, likes, comments} = post;

    postsHTML += `
    <section class="post">
      <div class="post-body">
        <h2 class="post-title">${title}</h2>
        <p class="post-text">
          ${text}
        </p>

        <div class="tags">
          ${tags}
          <a href="#" class="tag">#свежее</a>
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
          <a href="#" class="author-username">${author}</a>
          <span class="post-time">${date}</span>
        </div>
        <a href="#" class="author-link"><img src="img/avatar.jpeg" alt="avatar" class="author-avatar"></a>
      </div>
      <!-- /.post-author -->
    </div>
    <!-- /.post-footer -->
  </section>
    `
  });

  postWrapper.innerHTML = postsHTML;
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
  
  exitElem.addEventListener('click', event=>{
    event.preventDefault();
    setUsers.logOut(toogleAuthDom);
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
}

document.addEventListener('DOMContentLoaded', init());



