const MomentPrettyTitleFormat = "llll";
const MomentPrettyFormat = "lll";
$(document).ready(function () {
    const items = _.map(TermsYears['2023'], term => {
        return {
            label: Terms[term['term']].label,
            startDate: term['start_date'],
            startTime: term['start_time'],
        }
    });

    const todayDate = DateUtil.getTodayDate();
    const todayTime = DateUtil.getTodayTime();
    renderSolarTermTitle(`${todayDate} ${todayTime}`);
    renderSolarTermsDiagram({date: todayDate, time: todayTime}, items);
});

function renderSolarTermTitle(today) {
    const parent = $("#solarTermTitle");
    parent.html(`<h1>${moment(today).format(MomentPrettyTitleFormat)}</h1>`);
}

function renderSolarTermsDiagram(today, items) {
    // render diagram bars
    const parent = $("#solarTermsDiagram .diagram");
    const daysInYear = DateUtil.generateDays(2023);
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
    const highlightDay = (() => {
        const sameDay = _.find(items, item => {
            return item.startDate === today.date;
        });
        if (!_.isEmpty(sameDay) && today.time < sameDay.startTime) {
            return DateUtil.subtractOneDay(sameDay);
        }
        return today.date;
    })();
    $(`.diagram-day[data-day='${highlightDay}']`).addClass('highlight');

    //
    let currentSolarTerm = "";
    let nextSolarTerm = "";
    for (let item of items) {
        if (`${today.date} ${today.time}` > `${item.startDate} ${item.startTime}`) {
            currentSolarTerm = item;
            nextSolarTerm = items[items.indexOf(item) + 1];
        } else {
            break;
        }
    }
    renderSolarTermInfo(currentSolarTerm, nextSolarTerm);
}

async function renderSolarTermInfo(solarTerm, nextSolarTerm) {
    const solarTermPretty = moment(`${solarTerm.startDate} ${solarTerm.startTime}`).format(MomentPrettyFormat)
    const nextSolarTermPretty = moment(`${nextSolarTerm.startDate} ${nextSolarTerm.startTime}`).format(MomentPrettyFormat)

    const parent = $("#solarTermInfo");
    parent.empty();
    parent.append(`<h2>${solarTerm.label} <span>${solarTermPretty} - ${nextSolarTermPretty}</span></h2>`);
    parent.append(`<p></p>`)
    const wikiResp = await fetch(`https://zh.wikipedia.org/w/api.php?origin=*&action=query&prop=extracts&rawcontinue=1&format=json&exintro=&titles=${solarTerm.label}`)
    const wikiContent = await wikiResp.json();
    const wikiContentForSolarTerm = wikiContent.query.pages[Object.keys(wikiContent.query.pages)[0]];
    parent.append(wikiContentForSolarTerm.extract);
}
