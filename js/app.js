$(document).ready(()=>{
    const container = document.querySelector('#mainContainer');
    const resultButton = container.querySelector('#resultButton');
    const addTimeButton = container.querySelector('#addButton');
    const removeTimeButton = container.querySelector('#removeButton');
    const resultBox = container.querySelector('#result');
    let timeIntervals = container.querySelectorAll('.timeInterval');
    const errorsList = {
        inGreaterThanOut : 'O tempo de entrada não pode ser maior que o de saída'
    };

    if(timeIntervals.length === 1){
        $(removeTimeButton).toggleClass('disable', true);
    }

    $(resultButton).on({
        'click': calculateTimeSpended
    });
    $(removeTimeButton).on({
        'click': removeTimeInterval
    });
    $(addTimeButton).on({
        'click': addTimeInterval
    });

    class Time {
        constructor(hours, minutes){
            this.hours =  hours || 0;
            this.minutes =  minutes || 0;
        }
        isBiggerThan(time){
            if(this.hours > time.hours){
                return true;
            }else if(this.hours === time.hours && this.minutes > time.minutes){
                return true;
            }
            return false;
        } 

    };

    function calculateTimeSpended(e){
        let result = new Time(0,0);

        timeIntervals.forEach(timeInterval =>{
            const timeInInput = timeInterval.querySelector('.timeIn');
            const timeOutInput = timeInterval.querySelector('.timeOut');
            const timeIn = new Time(Number(timeInInput.value.split(':')[0]), Number(timeInInput.value.split(':')[1]));
            const timeOut = new Time(Number(timeOutInput.value.split(':')[0]), Number(timeOutInput.value.split(':')[1]));

            if(timeIn.isBiggerThan(timeOut)){
                return timeError(timeInInput,errorsList.inGreaterThanOut);
            };
            result = addTime(result, subtractTime(timeIn, timeOut));
        });

        resultBox.innerText = `Você trabalhou ${formatTime(result)}`;
    };

    function subtractTime(inTime, outTime){
        const hourIn = inTime.hours;
        const minuteIn = inTime.minutes;
        const hourOut = outTime.hours;
        const minuteOut = outTime.minutes;
        let result;
    
        if(minuteOut < minuteIn){
            let hours; 
            let minutes;
            hours = (hourOut - 1) - hourIn;
            minutes = (60 + minuteOut) - minuteIn;
            result = new Time(hours, minutes);
        }else{
            result = new Time(hourOut - hourIn, minuteOut - minuteIn);
        }
        return result;

    };

    function addTime(inTime, outTime){
        const hourIn = inTime.hours;
        const minuteIn = inTime.minutes;
        const hourOut = outTime.hours;
        const minuteOut = outTime.minutes;
        const minutes = minuteIn + minuteOut >= 60 ? (minuteIn + minuteOut) % 60 : minuteIn + minuteOut; 
        const hours = minuteIn + minuteOut >= 60 ? hourOut + hourIn + 1 : hourOut + hourIn; 

        return new Time(hours,minutes);
    };

    function removeTimeInterval(e){
        if($(e.target).hasClass('disable')) return; 
        const lastInterval = timeIntervals[timeIntervals.length-1];

        lastInterval.parentNode.removeChild(lastInterval);
        timeIntervals = container.querySelectorAll('.timeInterval');
        if(timeIntervals.length === 1){
            $(removeTimeButton).toggleClass('disable', true);
        }
    };

    function addTimeInterval(e){
        const newTimeInverval = timeIntervals[0].cloneNode(true);
        const lastInterval = timeIntervals[timeIntervals.length-1];

        lastInterval.parentNode.insertBefore(newTimeInverval, lastInterval.nextSibling);   
        $(removeTimeButton).toggleClass('disable', false);
        timeIntervals = container.querySelectorAll('.timeInterval');     
    };

    function formatTime(time){
        let hour = time.hours;
        let minute = time.minutes;     
        if(hour < 10){
            hour = '0' + hour;
        }
        if(minute < 10){
            minute = '0' + minute;
        }
        return hour + ':' + minute;
    };

    function timeError(element, message){
       const errorBox = $(element).next('.error');
       errorBox[0].innerText = message;
       errorBox.addClass('animated');
       setTimeout(function(){
        errorBox.removeClass('animated');
        errorBox[0].innerText = ``;
       },2000);
    };
});