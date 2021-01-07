/**
 * This file is only for collecting all other files together and having
 * them in one place for Webpack to compile into a single js file
 *
 * @author Tobias de Bruijn
 * @file index.ts
 */

//Code
export { getSingleMail } from "./getMailSingle";
export { getAllMail } from "./getAllMail";

//Styles
import "../scss/master.scss";