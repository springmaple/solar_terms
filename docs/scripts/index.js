const MomentPrettyTitleFormat = "llll";
const MomentPrettyFormat = "lll";
$(document).ready(function () {
    const todayDate = DateUtil.getTodayDate();
    const todayTime = DateUtil.getTodayTime();
    const todayYear = DateUtil.getTodayYear();

    const items = _.map(TermsYears[todayYear], term => {
        return {
            label: Terms[term['term']].label,
            startDate: term['start_date'],
            startTime: term['start_time'],
        }
    });

    renderSolarTermTitle(`${todayDate} ${todayTime}`);
    renderSolarTermsDiagram({date: todayDate, time: todayTime}, items);
});

function renderSolarTermTitle(today) {
    const parent = $("#solarTermTitle");
    parent.html(`<h1>${moment(today).format(MomentPrettyTitleFormat)}</h1>`);
}

function renderSolarTermsDiagram(today, items) {
    const daysInYear = DateUtil.generateDays(DateUtil.getTodayYear());
    // render diagram dates
    const parent3 = $("#solarTermsDiagram .date");
    _.map(daysInYear, day => {
        const dayBar = $(`<div data-day="${day}" class="diagram-day-date">${moment(day).format("MM/DD")}</div>`);
        parent3.append(dayBar);
    });
    _.map(items, item => {
        $(`.diagram-day-date[data-day='${item.startDate}']`).addClass('diagram-day-start');
    });

    // render diagram bars
    const parent = $("#solarTermsDiagram .diagram");
    _.map(daysInYear, day => {
        const dayBar = $(`<div data-day="${day}" class="diagram-day">
            <div data-day="${day}" class="diagram-day-length"></div>
        </div>`);
        parent.append(dayBar);
    });
    _.map(items, item => {
        $(`.diagram-day[data-day='${item.startDate}']`).addClass('diagram-day-start');
    });

    // render diagram bars day-length
    const maxDay = Math.pow(_.max(_.map(daysInYear, day => DayLengths[day])), 10);
    _.map(daysInYear, day => {
        const height = Math.pow(DayLengths[day], 10) / maxDay * 50;
        $(`.diagram-day-length[data-day="${day}"]`).css("height", height + "%");
    });

    // render diagram labels
    const parent2 = $("#solarTermsDiagram .label");
    _.map(daysInYear, day => {
        const dayBar = $(`<div data-day="${day}" class="diagram-day-label"></div>`);
        parent2.append(dayBar);
    });
    _.map(items, (item, index) => {
        $(`.diagram-day-label[data-day='${item.startDate}']`)
            .text(item.label)
            .addClass("clickable")
            .data("solarTerms", [item, items[index + 1]])
            .click(e => {
                $(".diagram-day-label.clickable").removeClass("highlight");
                const element = $(e.currentTarget);
                element.addClass("highlight");
                renderSolarTermInfo(...element.data("solarTerms"));
            });
    });

    // highlight
    const highlightDay = (() => {
        const sameDay = _.find(items, item => {
            return item.startDate === today.date;
        });
        if (!_.isEmpty(sameDay) && today.time < sameDay.startTime) {
            return DateUtil.subtractOneDay(sameDay);
        }
        return today.date;
    })();
    $(`.diagram-day-length[data-day='${highlightDay}']`).addClass('highlight');

    // click on solar term of the day
    let day = highlightDay;
    for (let i in _.range(20)) {
        const element = $(`.diagram-day-label[data-day='${day}']`);
        if (element.hasClass('clickable')) {
            element.click();
            break;
        }
        day = DateUtil.subtractOneDay(day);
    }
}

async function renderSolarTermInfo(solarTerm, nextSolarTerm) {
    const solarTermPretty = moment(`${solarTerm.startDate} ${solarTerm.startTime}`).format(MomentPrettyFormat)
    const nextSolarTermPretty = (() => {
        if (_.has(nextSolarTerm, "startDate"))
            return moment(`${nextSolarTerm.startDate} ${nextSolarTerm.startTime}`).format(MomentPrettyFormat)
    })();

    const parent = $("#solarTermInfo");
    parent.empty();
    if (_.isNil(nextSolarTermPretty)) {
        parent.append(`<h2>${solarTerm.label} <span>${solarTermPretty}</span></h2>`);
    } else {
        parent.append(`<h2>${solarTerm.label} <span>${solarTermPretty} - ${nextSolarTermPretty}</span></h2>`);
    }
    parent.append(`<p></p>`)
    const wikiResp = await fetch(`https://zh.wikipedia.org/w/api.php?origin=*&action=query&prop=extracts&rawcontinue=1&format=json&exintro=&titles=${solarTerm.label}`)
    const wikiContent = await wikiResp.json();
    const wikiContentForSolarTerm = wikiContent.query.pages[Object.keys(wikiContent.query.pages)[0]];
    parent.append(wikiContentForSolarTerm.extract);
}
