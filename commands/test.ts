import { ButtonStyle, ComponentType } from 'discord.js';
import { Command } from '../index.d';
import MetadataButton from '../MetadataButton';

export default {
    name: 'test',
    description: 'A test command.',
    execute: async interaction => {
        interaction.reply({
            content: 'This is a test command.',
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        new MetadataButton({
                            custom_id: 'test',
                            style: ButtonStyle.Primary,
                            type: ComponentType.Button,
                            label: 'Click me!'
                        }, {
                            hello: 123
                        })
                    ]
                }
            ]
        });
    }
} as Command;