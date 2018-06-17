
This a progressive web app that computes expressions.

Home page for this project is https://elf.org/calculator.

The app is available as https://calculator.elf.org.

Built with the https://github.com/Polymer/pwa-starter-kit using https://polymer-project.org.

To build you'll need to:
[ ] install nodejs and npm,
[ ] may need to install polymer-cli as a global npm app
    consult the pwa-starter for better details
[ ] run "npm install" in the top level directory
[ ] at this point you should be able to run "polymer serve"
    in the top level directory and open the web app in your
    browser at http://localhost:8081

To build build, run "npm run build" in the top-level directory
to make static images in build/ and a prpl-server suite of images
in server/ for differential serving.

The calculator layout is stolen from the calculator inlined when you
google "calculator".  It's got some cute parts that I haven't reproduced
as yet

In addition the calculator implements computations on Clifford geometric
algebras as implemented by
<a href="https://github.com/enkimute/ganja.js/wiki">ganja.js</a>, though
I've restrained myself to implementing the Euclidean 2 and 3 dimensional
algebras since I find them least confusing.
