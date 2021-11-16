## Hotel Greetings

This is a command-line program that outputs a custom greeting based on the guest, hotel, and greeting template chosen by the user. 

### How to Run

You can run this program on your local machine using Node.js. I am using Node v14.18.1, but it should be compatible with other versions as well. If you have Node installed, navigate to the project directory in a console window, and run the following command:

> node .\main.js

If you do not have Node installed, you can download it and find more information here: [Node.js](https://nodejs.org/en/).

### Language and Design Decisions

I chose javascript for this program due to its flexibility and ease of use. In a small application, a scripting language like JS makes it easy to iterate, and the total volume of code is minimal enough that any errors are easy to trace through the stack. In a larger, more robust application, I would probably choose to use C# on the back-end.

The basic structure of the program is dictated by the asynchronous nature of the readline module. Each successive step of soliciting user input needs to be called from within the callback function of the previous step. Since there are only three steps, I made a function for each of them, and the rest of the code is basically just helper methods and text string manipulation.
 
If there were more steps, it would make sense to abstract/generalize the functions for getting user input. You could have a class to represent a generic step, then the traits and methods shared by each step could be inherited from that common class, and any individual features could be coded exactly as needed.

### Verification

I verified this program through manual testing on my local machine. I used a variety of different inputs, and observed that the program does not proceed unless a number representing a valid option is input; this is the expected behavior.

### Next Steps

A logical next step for this program would be to create a GUI instead of having the user interact through the command line. Given the simplicity, I would use vanilla javascript to populate a few select elements and an input box for the custom greeting; if the application was meant to scale or become significantly more complex in the future, it might be beneficial to use a front-end framework such as Angular or React.