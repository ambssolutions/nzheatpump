/* The one place for business facts. Every page reads this file.
   Anything left empty stays hidden on the site (data-need="key"). Never fill a gap with a made-up value.
   See CONTENT-NEEDED.md for what the client still has to send. */
window.SITE = {
  name: "NZ Heat Pump Services",
  region: "Waikato",

  phone: "",          // as people read it, e.g. "07 123 4567"
  phoneTel: "",       // for phones, e.g. "+6471234567"
  email: "",          // e.g. "office@example.co.nz"
  address: "",        // base or yard address, if they want it shown
  hours: "",          // e.g. "Monday to Friday, 7.30am to 5pm"
  ewrb: "",           // electrical licence or company registration line, if they want it shown

  // Real reviews only, with the customer's permission: { text: "…", name: "Sam, Cambridge" }
  reviews: [],

  // Form delivery. Leave empty to open the visitor's email app (needs email above).
  formEndpoint: "",   // e.g. "https://api.web3forms.com/submit"
  web3formsKey: ""
};
