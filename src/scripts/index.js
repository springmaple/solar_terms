$(document).ready(function () {
    const items = _.map(TermsYears['2023'], term => {
        return {
            label: Terms[term['term']].label,
            startDate: term['start_date'],
            startTime: term['start_time'],
        }
        // {term: 'XiaoHan', start_date: '2023-01-05', start_time: '23:05:00',},
    });

    renderSolarTermsDiagram(items);
});

function renderSolarTermsDiagram(items) {
    // render diagram bars
    const parent = $("#solarTermsDiagram .diagram");
    const daysInYear = generateDays(2023);
    _.map(daysInYear, day => {
        const dayBar = $(`<div data-day="${day}" class="diagram-day"></div>`);
        parent.append(dayBar);
    });
    _.map(items, item => {
        $(`.diagram-day[data-day='${item.startDate}']`).addClass('diagram-day-start');
    });

    // render diagram labels
    const parent2 = $("#solarTermsDiagram .label");
    _.map(daysInYear, day => {
        const dayBar = $(`<div data-day="${day}" class="diagram-day-label"></div>`);
        parent2.append(dayBar);
    });
    _.map(items, item => {
        $(`.diagram-day-label[data-day='${item.startDate}']`).text(item.label);
    });

    //
    const todayDate = getTodayDate();
    const todayTime = getTodayTime();
    const highlightDay = (() => {
        const sameDay = _.find(items, item => {
            return item.startDate === todayDate;
        });
        if (!_.isEmpty(sameDay) && todayTime < sameDay.startTime) {
            return subtractOneDay(sameDay);
        }
        return todayDate;
    })();
    $(`.diagram-day[data-day='${highlightDay}']`).addClass('highlight');

    //
    let currentSolarTerm = "";
    let nextSolarTerm = "";
    for (let item of items) {
        if (`${todayDate} ${todayTime}` > `${item.startDate} ${item.startTime}`) {
            currentSolarTerm = item;
            nextSolarTerm = items[items.indexOf(item) + 1];
        } else {
            break;
        }
    }
    renderSolarTermInfo(currentSolarTerm, nextSolarTerm);
}

async function renderSolarTermInfo(solarTerm, nextSolarTerm) {
    const parent = $("#solarTermInfo");
    parent.empty();
    parent.append(`<h2>${solarTerm.label}</h2>`);
    parent.append(`<p>${solarTerm.startDate} ${solarTerm.startTime} - ${nextSolarTerm.startDate} ${nextSolarTerm.startTime}</p>`)
    const wikiResp = await fetch(`https://zh.wikipedia.org/w/api.php?origin=*&action=query&prop=extracts&rawcontinue=1&format=json&exintro=&titles=${solarTerm.label}`)
    const wikiContent = await wikiResp.json();
    const wikiContentForSolarTerm = wikiContent.query.pages[Object.keys(wikiContent.query.pages)[0]];
    parent.append(wikiContentForSolarTerm.extract);
}

function generateDays(year) {
    function formatDate(date) {
        const year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-based
        let day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const days = [];
    for (let month = 0; month < 12; month++) {
        for (let day = 1; day <= 31; day++) {
            // Create a Date object with the current year, month, and day
            const date = new Date(year, month, day);

            // Check if the month in the Date object matches the current month
            if (date.getMonth() === month) {
                days.push(formatDate(date));
            }
        }
    }
    return days;
}

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = (today.getMonth() + 1).toString().padStart(2, '0');
    let day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getTodayTime() {
    const today = new Date();
    let hours = today.getHours().toString().padStart(2, '0');
    let minutes = today.getMinutes().toString().padStart(2, '0');
    let seconds = today.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function subtractOneDay(dateString) {
    // Convert the string to a Date object
    const date = new Date(dateString);

    // Subtract one day (24 hours in milliseconds)
    date.setDate(date.getDate() - 1);

    // Get the year, month, and day components
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    // Return the updated date in "yyyy-MM-dd" format
    return `${year}-${month}-${day}`;
}