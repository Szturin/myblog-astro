import { ItemView, Notice, Plugin, WorkspaceLeaf } from 'obsidian';

const VIEW_TYPE = 'hello-world-button-view';

class HelloButtonView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return VIEW_TYPE;
	}

	getDisplayText(): string {
		return 'Hello World Button';
	}

	getIcon(): string {
		return 'hand';
	}

	async onOpen(): Promise<void> {
		const container = this.containerEl.children[1];
		container.empty();
		container.addClass('hello-button-container');

		const btn = container.createEl('button', {
			text: 'Click Me!',
			cls: 'hello-button',
		});

		btn.addEventListener('click', () => {
			new Notice('Hello World!');
		});
	}

	async onClose(): Promise<void> {}
}

export default class HelloWorldButtonPlugin extends Plugin {
	async onload() {
		this.registerView(VIEW_TYPE, (leaf) => new HelloButtonView(leaf));

		this.addRibbonIcon('hand', 'Hello World Button', () => {
			this.activateView();
		});

		this.addCommand({
			id: 'open-hello-button',
			name: 'Open Hello World Button',
			callback: () => this.activateView(),
		});
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE);
	}

	async activateView() {
		const { workspace } = this.app;
		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE);

		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getRightLeaf(false);
			await leaf.setViewState({ type: VIEW_TYPE, active: true });
		}

		workspace.revealLeaf(leaf);
	}
}
