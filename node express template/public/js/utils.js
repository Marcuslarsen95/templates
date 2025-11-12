/**
 * @param {string} s - query selector element "p", ".class" or by id "#id"
 * @param {string} e - event listener e.g "click" 
 * @param {function} c - callback function  
 */
export async function when(s, e, c){
    document.querySelector(s).addEventListener(e, c);
}



// capitalize function 

export const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
