export const getDayName = (d) => {
    const dateObject = new Date(d);

    const dayOfWeek = dateObject.getDay();

    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return weekDays[dayOfWeek];
}