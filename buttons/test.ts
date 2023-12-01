import { Button } from '../index.d';

export default {
    name: 'test',
    execute(interaction, metadata) {
        interaction.reply({
            content: 'Button works!\n' +
            (metadata ? '```json\n' + JSON.stringify(metadata, null, 4) + '\n```' : '')
        });
    }
} as Button;