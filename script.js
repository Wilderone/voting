
const progress = document.querySelectorAll('.progress-bar');
const header = new Headers({});
const url = new URL('https://sf-pyw.mosyag.in/');
const urlvotes = new URL('/sse/vote/stats', url);
const mes = document.querySelector('.message')
const ESresults = new EventSource(urlvotes, header);
const btn = document.querySelector('.votebtns');
const progressbars = document.querySelector('.progressbars');


function showResults() {
    if (progressbars.classList.contains('hidden')) {
        progressbars.classList.remove('hidden')
    }
};

// Не стал привязывать запрос к конкретной кнопке, а 
// сделал зависимость от id. В POST запрос 
// передаётся id нажатой кнопки. Таким образом проект
// можно легко масштабировать

function voting(target) {
    let newurl = `https://sf-pyw.mosyag.in/sse/vote/${target.id}`
    fetch(newurl, {
        method: 'POST',
    })
    mes.textContent = `Вы проголосовали за ${target.textContent}`


}

btn.addEventListener('click', function (event) {
    let target = event.target;
    voting(target);
    showResults();
    for (let i = 0; i < btn.children.length; i++) {
        btn.children[i].disabled = true;
    }

}
);

ESresults.onerror = error => {
    ESresults.readyState ? progress.textContent = `error ${error}` : null;
}
// Тут я решил предусмотреть возможность добавления новых 
// результатов голосования без создания туевой хучи объектов
// понятно что можно было через 
// elem.style.cssText = `width: ${votes[i]}%;`; обновлять каждый
// прогресс-бар, но что если их сотня? :)
// единственное ограничение - есть зависимость от порядка присылаемой сервером инфы
function toPercent(data) {
    let votePull = JSON.parse(data.data)
    //console.log(votePull)
    let result = []
    let voteSumm = votePull.cats + votePull.dogs + votePull.parrots;
    let vals = Object.values(votePull)
    for (let i = 0; i < vals.length; i++) {
        result[i] = Math.round((vals[i] * 100) / voteSumm)
        //result[i] = vals[i];
    }
    return result;
}

ESresults.onmessage = message => {
    // добавил чисто для проверки работы. Первую секунду показывает до обновления
    document.querySelector('.results').textContent = `всего голосов (для проверки), обновление при 
    следующем пакете от сервера (примерно 1с) ${message.data}`;
    let votes = toPercent(message)
    //console.log(votes)
    for (let i = 0; i < votes.length; i++) {
        progress[i].style.cssText = `width: ${votes[i]}%;`;
        progress[i].textContent = `${votes[i]}%`;
    }
}

