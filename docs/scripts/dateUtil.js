const DateUtil = {
    generateDays: function (year) {
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
    },

    getTodayYear: function () {
        return moment(this.getTodayDate()).format('YYYY');
    },

    getTodayDate: function () {
        const today = new Date();
        const year = today.getFullYear();
        let month = (today.getMonth() + 1).toString().padStart(2, '0');
        let day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    getTodayTime: function () {
        const today = new Date();
        let hours = today.getHours().toString().padStart(2, '0');
        let minutes = today.getMinutes().toString().padStart(2, '0');
        let seconds = today.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    },

    subtractOneDay: function (dateString) {
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
}