import { APIButtonComponentWithCustomId, APIMessageComponentEmoji, ComponentType } from 'discord.js';

/** Please note that this can only hold up to `75 - length of custom_id` characters as metadata. */
export default class MetadataButton implements APIButtonComponentWithCustomId {
    readonly type = ComponentType.Button;
    metadata: any;
    custom_id: string;
    style: number;
    disabled?: boolean;
    emoji?: APIMessageComponentEmoji;
    label?: string;

    constructor(button: APIButtonComponentWithCustomId, metadata?: any) {
        this.custom_id = button.custom_id;
        this.style = button.style;
        this.disabled = button.disabled;
        this.emoji = button.emoji;
        this.label = button.label;

        return Object.assign(this, {
            custom_id: JSON.stringify({
                action: button.custom_id,
                metadata
            })
        })
    }
}