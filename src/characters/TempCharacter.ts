/**
 * TempCharacter Class
 * 
 * A temporary character implementation for testing the BaseCharacter functionality.
 * This class will be replaced with proper character classes (Archer, etc.) later.
 */

import { BaseCharacter } from './BaseCharacter.js';

/**
 * Temporary character implementation for testing
 */
export class TempCharacter extends BaseCharacter {
    /**
     * Override the onRightClick method from BaseCharacter
     */
    public onRightClick(): void {
        console.log('Right click action performed by TempCharacter');
    }
} 