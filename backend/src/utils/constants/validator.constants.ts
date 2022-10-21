/* 
    0x - starts with '0x'
    [A-Fa-f0-9] - allowed values
    i - case insensitive
 */
export const HASH_SHA512_PATTERN = /^0x([a-f0-9]{64})$/i;
export const HASH_SHA1_PATTERN = /^0x([a-f0-9]{40})$/i;
