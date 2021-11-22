## Hotel Greetings

This is a command-line program that outputs a custom greeting based on the guest, hotel, and greeting template chosen by the user. 

### How to Run

You can run this program on your local machine using Node.js. I am using Node v14.18.1, but it should be compatible with other versions as well. If you have Node installed, navigate to the project directory in a console window, and run the following command:

> node .\main.js

If you do not have Node installed, you can download it and find more information here: [Node.js](https://nodejs.org/en/).

### Language and Design Decisions

I chose javascript for this program due to its flexibility and ease of use. In a small application, a scripting language like JS makes it easy to iterate, and the total volume of code is minimal enough that any errors are easy to trace through the stack. In a larger, more robust application, I would probably choose to use C# on the back-end.

The main class within the program is called categoryObject, and the code instantiates an object for each of the steps where user input is needed: guest, hotel, and template. This design is meant to make it easier to add more steps as required in the future. Ideally the function that prompts for user input would also be included within the categoryObject class, but the asynchronous nature of the console readline module makes that tricky to implement, as the function for soliciting the next step of input needs to be included within the callback function of the previous step's readline call. In a GUI where users are presented with all options at once rather than sequentially, including a getInput function in the class would make much more sense.

### Verification

I verified this program through manual testing on my local machine. I used a variety of different inputs, and observed that the program does not proceed unless a number representing a valid option is input; this is the expected behavior. There are some drawbacks to the way placeholder names are used in the templates; the placeholder names themselves are essentially off limits for use in the greeting message, as the code will go ahead and replace them with values. You could get around this by prepending them with some sort of symbol and changing the keys of the replacements object appropriately, but that might sacrifice a bit of user-friendliness with regard to the custom message templates. 

### Next Steps

A logical next step for this program would be to create a GUI instead of having the user interact through the command line. Given the simplicity, I would use vanilla javascript to populate a few select elements and an input box for the custom greeting; if the application was meant to scale or become significantly more complex in the future, it might be beneficial to use a front-end framework such as Angular or React.