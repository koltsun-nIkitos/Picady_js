"use strict";


// import validator from './validate.js';

const menuToggle = document.querySelector('#menu-toggle');
const menu = document.querySelector('.sidebar');

menuToggle.addEventListener('click', function (event) {
  event.preventDefault();
  menu.classList.toggle('visible');
})

const loginElem = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const emailInput = document.querySelector('.login-email');
const passwordInput = document.querySelector('.login-password');
const loginSignup = document.querySelector('.login-signup');

const userElem = document.querySelector(".user");
const userNameElem = document.querySelector(".user-name");



const listUsers = [
  {
    id: '01',
    email : "kolstun-nv@yandex.ru",
    password: '12345',
    displayName: "KoltsNik"
  },
  {
    id: '02',
    email : "kate@yandex.ru",
    password: '123456',
    displayName: "katyParry"
  }
];

const setUsers = {
  user: null,

  logIn(email, password, handler) {
    const user = this.getUser(email);

    if (user && user.password === password){
      this.authorizedUser(user);
      handler();
    } else{
      alert('Пользователь с такими данными не найден')
    }
  },

  logOut() {
    console.log("выход");
  },

  signUp(email, password, handler) {

    if (!email.trim() || !password.trim()){
      alert('Введите данные');
      return
    }

    if (!this.getUser(email)){
      const user = { email, password, displayName: email }
      listUsers.push(user);
      this.authorizedUser(user);
      handler();
    }else{
      alert('Пользователь с таким именем уже зарегистрирован')
    }
  },

  getUser(email){
    return listUsers.find(item => item.email === email)
  },

  authorizedUser(user){
    this.user = user;
  }
};

const toogleAuthDom = ()=>{
  const user = setUsers.user;

  if (user){
    loginElem.style.display = 'none';
    userElem.style.display = '';
    userNameElem.textContent = user.displayName;
  }else{
    loginElem.style.display = '';
    userElem.style.display = 'none';
  };
}


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
})

toogleAuthDom();


