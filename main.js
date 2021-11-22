// Initialize the module and object we'll use to read/write from the console
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const prompts = {
    selectHotel: "===== ENTER A NUMBER TO SELECT A HOTEL =====\n",
    selectGuest: "===== ENTER A NUMBER TO SELECT A GUEST =====\n",
    selectTemplate: "===== ENTER A NUMBER TO SELECT A GREETING =====\n",
    createTemplate: "===== ENTER A CUSTOM GREETING =====\n"
}

// Parse each of the json files to an array of objects.
// I'm not using any error handling here since the files are static in this little application, but in real-world
// use cases, you would want to handle any errors that arise when parsing from text files like this.
const filepaths = {
    guest: './Guests.json',
    hotel: './Companies.json',
    template: './Templates.json'
};

// This class is used to create the properties for the guest, hotel, and template objects.
// Abstracting into a class will make it easier to add categories in the future if additional inputs are added to the template format.
class categoryObject {
    constructor(categoryName){
        this.categoryName = categoryName;
        this.items = require(filepaths[categoryName]);
        this.selectMessage = (function(categoryName, items){
            let text;
            if (categoryName === 'guest'){
                text = prompts.selectGuest;
                items.forEach(guest => {
                    text += `${guest.id}: ${guest.firstName} ${guest.lastName} \n`; 
                })        
            } else if (categoryName === 'hotel'){
                text = prompts.selectHotel;
                items.forEach(hotel => {
                    text += `${hotel.id}: ${hotel.company} \n`; 
                })
            } else if (categoryName === 'template'){
                text = prompts.selectTemplate
                text += "0: Custom Greeting \n";
                items.forEach(template => {
                    text += `${template.id}: ${template.text} \n`; 
                });
            };
            return text;
        })(categoryName, this.items);
        this.errorMessage = `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} not found! Please try again.\n`
    };
};

// Returns the word referencing the time of day based on the current hour.
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

// This helper function takes in a timestamp of the form seen in the guests.json file and returns that time in a more readable format.
function formatTimestamp(timestamp) {
    let d = new Date(timestamp);
    return d.toLocaleDateString('en-US') + ' ' + d.toLocaleTimeString('en-US');
};

let guest, hotel, template; // These global variables are set by the user input from within the readline questions
let guestObject = new categoryObject('guest');
let hotelObject = new categoryObject('hotel');
let templateObject = new categoryObject('template');

// getGuest, getHotel, and getTemplate are stepped through in order, getting input from the user at each step
function getGuest(){
    rl.question(guestObject.selectMessage, function(res){
        guest = guestObject.items.find(guest => guest.id == res);
        guest ? getHotel() : handleInputError(guestObject.errorMessage, getGuest); // If guest is non-null, advance to the next step
    });
};

function getHotel(){
    rl.question(hotelObject.selectMessage, function(res){
        hotel = hotelObject.items.find(hotel => hotel.id == res);
        hotel ? getTemplate() : handleInputError(hotelObject.errorMessage, getHotel); // If hotel is non-null, advance to the next step
    });
};

function getTemplate(){
    rl.question(templateObject.selectMessage, function(res){
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
            template = templateObject.items.find(template => template.id == res);
            template ? greet() : handleInputError(templateObject.errorMessage, getTemplate); // Once guest, hotel, and template are all non-null, call the greet function
        };
    });
};

function handleInputError(message, callback){
    console.log(message);
    callback();
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

getGuest();