import { Command } from '../index.d';

export default {
    name: 'test',
    description: 'A test command.',
    execute: async interaction => {
        interaction.reply({
            content: 'This is a test command.'
        });
    }
} as Command;