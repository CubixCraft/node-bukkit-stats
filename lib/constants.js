exports.PACKETS = {
	keepAlive: 0x00,
	loginRequest: 0x01,
	handshake: 0x02,
	chatMessage: 0x03,
	timeUpdate: 0x04,
	entityEquipment: 0x05,
	spawnPosition: 0x06,
	useEntity: 0x07,
	updateHealth: 0x08,
	respawn: 0x09,
	player: 0x0A,
	playerPosition: 0x0B,
	playerLook: 0x0C,
	playerPositionandLook: 0x0D,
	playerDigging: 0x0E,
	playerBlockPlacement: 0x0F,
	heldItemChange: 0x10,
	useBed: 0x11,
	animation: 0x12,
	entityAction: 0x13,
	spawnNamedEntity: 0x14,
	spawnDroppedItem: 0x15,
	collectItem: 0x16,
	spawnObject: 0x17,
	spawnVehicle: 0x17,
	spawnMob: 0x18,
	spawnPainting: 0x19,
	spawnExperienceOrb: 0x1A,
	entityVelocity: 0x1C,
	destroyEntity: 0x1D,
	entity: 0x1E,
	entityRelativeMove: 0x1F,
	entityLook: 0x20,
	entityLookandRelativeMove: 0x21,
	entityTeleport: 0x22,
	entityHeadLook: 0x23,
	entityStatus: 0x26,
	attachEntity: 0x27,
	entityMetadata: 0x28,
	entityEffect: 0x29,
	removeEntityEffect: 0x2A,
	setExperience: 0x2B,
	chunkData: 0x33,
	multiBlockChange: 0x34,
	blockChange: 0x35,
	blockAction: 0x36,
	blockBreakAnimation: 0x37,
	mapChunkBulk: 0x38,
	explosion: 0x3C,
	soundOrParticleEffect: 0x3D,
	namedSoundEffect: 0x3E,
	changeGameState: 0x46,
	thunderbolt: 0x47,
	openWindow: 0x64,
	closeWindow: 0x65,
	clickWindow: 0x66,
	setSlot: 0x67,
	setWindowItems: 0x68,
	updateWindowProperty: 0x69,
	confirmTransaction: 0x6A,
	creativeInventoryAction: 0x6B,
	enchantItem: 0x6C,
	updateSign: 0x82,
	itemData: 0x83,
	updateTileEntity: 0x84,
	incrementStatistic: 0xC8,
	playerListItem: 0xC9,
	playerAbilities: 0xCA,
	tabComplete: 0xCB,
	localeandViewDistance: 0xCC,
	clientStatuses: 0xCD,
	pluginMessage: 0xFA,
	encryptionKeyResponse: 0xFC,
	encryptionKeyRequest: 0xFD,
	serverListPing: 0xFE,
	disconnect: 0xFF,
	kick: 0xFF
};

exports.CTRL = {
	delimeter: 0xA7,
	missingByte: 0x00
};

exports.CONNECTION = {
	defaultHost: "localhost",
	defaultPort: 25565
};

exports.ERRORS = {
	unknown: "An unknown error occured: ",
	timeout: "Server took too long to replay. Timeout!",
	close: "Connection closed unexpectedly!",
	format: "Server returned an invalid response!"
};