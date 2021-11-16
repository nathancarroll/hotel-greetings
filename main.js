// Initialize the module and object we'll use to read/write from the console
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Parse each of the json files to an array of objects.
// I'm not using any error handling here since the files are static in this little application, but in real-world
// use cases, you would want to handle any errors that arise when parsing from text files like this.
const guests = require('./Guests.json');
const hotels = require('./Companies.json');
const templates = require('./Templates.json');

const prompts = {
    selectHotel: "===== ENTER A NUMBER TO SELECT A HOTEL =====\n",
    selectGuest: "===== ENTER A NUMBER TO SELECT A GUEST =====\n",
    selectTemplate: "===== ENTER A NUMBER TO SELECT A GREETING =====\n",
    createTemplate: "===== ENTER A CUSTOM GREETING =====\n"
};

// Returns a string for display to the user with numbered options for guest, hotel, or greeting
function getSelectText(category){
    let text;
    if (category === 'guest'){
        text = prompts.selectGuest;
        guests.forEach(guest => {
            text += `${guest.id}: ${guest.firstName} ${guest.lastName} \n`; 
        })        
    } else if (category === 'hotel'){
        text = prompts.selectHotel;
        hotels.forEach(hotel => {
            text += `${hotel.id}: ${hotel.company} \n`; 
        })
    } else if (category === 'template'){
        text = prompts.selectTemplate
        text += "0: Custom Greeting \n";
        templates.forEach(template => {
            text += `${template.id}: ${template.text} \n`; 
        });
    };  
    return text;
};

// Returns the word referencing the time of day based on the current hour
function getTimeOfDay(){
    let timeOfDay;
    let hour = new Date().getHours();
    if (hour < 4){
        timeOfDay = "evening";
    } else if (hour < 12){
        timeOfDay = "morning";
    } else if (hour < 17){
        timeOfDay = "afternoon";
    } else {
        timeOfDay = "evening";
    }
    return timeOfDay;
};

// This helper function takes in a timestamp of the form seen in the guests.json file and returns that time in a more readable format
function formatTimestamp(timestamp) {
    let d = new Date(timestamp);
    return d.toLocaleDateString('en-US') + ' ' + d.toLocaleTimeString('en-US');
};

let guest, hotel, template; // These global variables are set by the user input from within the readline questions

// getGuest, getHotel, and getTemplate are stepped through in order, getting input from the user at each step
function getGuest(){
    rl.question(getSelectText('guest'), function(res){
        guest = guests.find(guest => guest.id == res);
        guest ? getHotel() : handleInputError('guest'); // If guest is non-null, advance to the next step
    });
};

function getHotel(){
    rl.question(getSelectText('hotel'), function(res){
        hotel = hotels.find(hotel => hotel.id == res);
        hotel ? getTemplate() : handleInputError('hotel'); // If hotel is non-null, advance to the next step
    });
};

function getTemplate(){
    rl.question(getSelectText('template'), function(res){
        if (res == 0){  // Custom greeting template 
            rl.question(prompts.createTemplate, function(res){
                template = {
                    id: 0,
                    name: "custom",
                    text: res
                };
                greet();
            });
        } else { // Pre-existing greeting template
            template = templates.find(template => template.id == res);
            template ? greet() : handleInputError('template'); // Once guest, hotel, and template are all non-null, call the greet function
        };
    });
};

// Provides feedback to the user and restarts whichever step of the process just failed
function handleInputError(category){
    if (category === 'guest'){
        console.log('Guest not found! Please try again. \n');
        getGuest();        
    } else if (category === 'hotel'){
        console.log('Hotel not found! Please try again. \n');
        getHotel();
    } else if (category === 'template'){
        console.log('Template not found! Please try again. \n');
        getTemplate();
    };
};

// Prints the greeting to the console
function greet(){
    let greeting = template.text;

    let replacements = {
        firstName: guest.firstName,
        lastName: guest.lastName,
        roomNumber: guest.reservation.roomNumber,
        checkIn: formatTimestamp(guest.reservation.startTimestamp),
        checkOut: formatTimestamp(guest.reservation.endTimestamp),
        hotel: hotel.company,
        city: hotel.city,
        timezone: hotel.timezone,
        timeOfDay: getTimeOfDay()
    };

    // Replace the variable names in the template with the values from the guest and company objects selected by the user
    for (const [key, value] of Object.entries(replacements)) {
        greeting = greeting.replace(key, value);
    }

    console.log('\n\n' + greeting + '\n\n');
    rl.close(); // Close the readline process so the program terminates instead of perpetually awaiting input from the console
};

// The initial call to getGuest sets the program in motion
getGuest();