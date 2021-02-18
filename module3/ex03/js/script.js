window.addEventListener('DOMContentLoaded', function (){
    'use strict';
    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');

    function hideTabContent(a){
        for (let i = a; i < tabContent.length; i++){
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }
    hideTabContent(1);

    function showTabContent(b) {
        if (tabContent[b].classList.contains('hide')){
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    info.addEventListener('click',function (event){
        let target = event.target;

        if (target && target.classList.contains('info-header-tab')){
            for(let i = 0; i < tab.length; i++){
                if (target == tab[i]){
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }
    });
    // Зачем применять делегирование событий? чтобы не назначать событие на каждый дочерний элемент родителя.

// Таймер

    let deadline = '2020-10-21';

    function getTimeRemaining(endtime){
        let t = Date.parse(endtime) - Date.parse(new Date()),
            seconds = Math.floor((t/1000)%60),
            minutes = Math.floor((t/1000/60)%60),
            hours = Math.floor((t/(1000*60*60)));

        return {
            'total' : t,
            'hours' : hours,
            'minutes' : minutes,
            'seconds' : seconds
        };
    }

    function setClock(id, endtime){
        let timer = document.getElementById(id),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000);


        function updateClock(){
            let t = getTimeRemaining(endtime);

            function addZero(num){
                if (num <= 9) {
                    return '0' + num;
                }  else return num;
            };
            hours.textContent = addZero(t.hours);
            minutes.textContent = addZero(t.minutes);
            seconds.textContent = addZero(t.seconds);

            if (t.total <= 0){
                clearInterval((timeInterval));
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
            }
        }
    }

    setClock('timer', deadline);

    // Modal

    let more = document.querySelector('.more'),
        overlay = document.querySelector('.overlay'),
        close = document.querySelector('.popup-close');

    function showModal(btn){
        overlay.style.display = 'block';
        btn.classList.add('more-splash');
        document.body.style.overflow = 'hidden';
    }
    more.addEventListener('click', function (){
        showModal(more);
    });

    close.addEventListener('click' , function (){
        let moreSplash = document.querySelector('.more-splash');
        overlay.style.display = 'none';
        moreSplash.classList.remove('more-splash');
        document.body.style.overflow = '';
    });

    let btnDescription = document.querySelector('.info');
    btnDescription.addEventListener('click',function(event){
        if (event.target.className == 'description-btn') {
            showModal(event.target);
        }
    });

// form

    let message = {
        loading : 'Загрузка...',
        success : 'Спасибо! Скоро мы с вами свяжемся',
        failure : 'Что то пошло не так'
    };

    function sendRequest(form){

        let request = new XMLHttpRequest();

        request.open('POST', 'server.php');
        // request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

        let formData = new FormData(form);

        let obj ={};
        formData.forEach(function (value, key){
            obj[key]=value;
        });
        let json = JSON.stringify(obj);
        request.send(json);
        // request.send(formData);

        let  statusMessage = document.createElement('div');
        statusMessage.classList.add('status');
        form.appendChild(statusMessage);
        request.addEventListener('readystatechange', function (){
            if (request.readyState < 4) {
                statusMessage.innerHTML = message.loading;
            } else if (request.readyState === 4 && request.status == 200) {
                statusMessage.innerHTML = message.success;
            } else {
                statusMessage.innerHTML = message.failure;
            }
        });
    }
    function clearInput(form) {
        let input = form.getElementsByTagName('input');
        for (let i = 0; i < input.length; i++) {
            input[i].value = '';
        }
    }
    let forms = document.querySelectorAll('form');
        forms.forEach(function (form){
            form.addEventListener('submit', function (event){
                event.preventDefault();  //Сбрасываем стандартный обработчик события
                sendRequest(form); //отправляем запрос
                clearInput(form); // чистим input
            });
        });

// slider
    let slideIndex = 1,
        slides = document.querySelectorAll('.slider-item'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        dotsWrap = document.querySelector('.slider-dots'),
        dots = document.querySelectorAll('.dot');

    function showSlides(n) {

        if (n > slides.length){
            slideIndex = 1;
        }
        if (n < 1){
            slideIndex = slides.length;
        }
        slides.forEach((item) => item.style.display = 'none');
        dots.forEach((item) => item.classList.remove('dot-active'));

        slides[slideIndex-1].style.display = 'block';
        dots[slideIndex - 1].classList.add('dot-active');
    }

    function plussSlides(n){
       showSlides(slideIndex += n);
    }
    function currentSlide(n){
        showSlides(slideIndex = n);
    }

    prev.addEventListener('click', function (){
        plussSlides(-1);
    });

    next.addEventListener('click', function (){
      plussSlides(1);
    });

    dotsWrap.addEventListener('click' , function (event){
      for (let i = 0; i < dots.length + 1; i++)  {
          if (event.target.classList.contains('dot') && event.target == dots[i-1]){
              currentSlide(i);
          }
      }
    });
    showSlides();


// calc
    let persons = document.querySelectorAll('.counter-block-input')[0],
        restDays = document.querySelectorAll('.counter-block-input')[1],
        place = document.getElementById('select'),
        totalValue = document.getElementById('total'),
        personsSum = 0,
        daysSum = 0,
        total = 0;

        totalValue.innerHTML = 0;

        persons.addEventListener('change', function (){
           personsSum = +this.value;
           total = (daysSum + personsSum) * 4000;

           if(restDays.value == '' || persons.value == ''){
               totalValue.innerHTML = 0;
           } else {
               totalValue.innerHTML = total;
           }
        });

    restDays.addEventListener('change', function () {
        daysSum = +this.value;
        total = (daysSum + personsSum) * 4000;
        console.log(persons.value);
        if (persons.value == '' || restDays.value == '') {
            totalValue.innerHTML = 0;
        } else {
            totalValue.innerHTML = total;
        }
    });
    place.addEventListener('change', function (){
       if (restDays.value == '' || persons.value == ''){
           totalValue.innerHTML = 0;
       } else {
           let a = total;
           totalValue.innerHTML = a * this.options[this.selectedIndex].value;
       }
    });

    $('.main_btna, .main_btn, a[href="#sheldure"]').click(function (){
        $('.overlay').fadeIn(1000);
        $('.modal').slideDown(1000);
    });

    $('.close').click(function (){
        $('.modal').slideUp(1000);
        $('.overlay').fadeOut(5000);
    });
    });
