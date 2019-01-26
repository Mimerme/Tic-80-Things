from Substrate.hack import Hack

# Offsets courtesy of hazedumper
glow_object_manager_off = 0x520DAE0
glow_index_off = 0xA3F8
team_off = 0xF4
local_player_off = 0xCBD6A4
entity_list_off = 0x4CCDCBC

local_player = -69

csgo = Hack("csgo.exe");

csgo.change_window_title("Counter-Strike: Global Offensive", "Hacked CSGO")
csgo.get_base_address()

client_panorama = csgo.module_base_dict["client_panorama.dll"]

print client_panorama

while local_player == -69:
	local_player, _ = csgo.read_dword(client_panorama + local_player_off)

#print "Found local player"
#print local_player


while True:
	glow_object, _ = csgo.read_dword(client_panorama + glow_object_manager_off)
	#print glow_object

	playerTeam, _ = csgo.read_int(local_player + team_off)
	#print "MYTEAM: " + str(playerTeam)
	#weapon, _ = csgo.read_int(local_player + 0x2EF8)
	#print weapon

	#Loop according to how many players on on the server
	for i in range(0, 10):
		entity, _ = csgo.read_dword(client_panorama + entity_list_off + (i * 0x10))
		entity_team, _ = csgo.read_int(entity + team_off)
		glow_index, _ = csgo.read_int(entity + glow_index_off)


		#if entity_team == playerTeam:
		#	csgo.write_float(glow_object + ((glow_index * 0x38) + 0x4), 0)
		#	csgo.write_float(glow_object + ((glow_index * 0x38) + 0x8), 0)
		#	csgo.write_float(glow_object + ((glow_index * 0x38) + 0xC), 1)
		#	csgo.write_float(glow_object + ((glow_index * 0x38) + 0x10), 1)
		#else:
		#	csgo.write_float(glow_object + ((glow_index * 0x38) + 0x4), 1)
		#	csgo.write_float(glow_object + ((glow_index * 0x38) + 0x8), 0)
		#	csgo.write_float(glow_object + ((glow_index * 0x38) + 0xC), 0)
		#	csgo.write_float(glow_object + ((glow_index * 0x38) + 0x10),1)

		print str(glow_object + ((glow_index * 0x38)))
		#print "Their team: " + str(entity_team)
		#print entity
		#print glow_index

		#csgo.write_char(glow_object + ((glow_index * 0x38) + 0x23), 0x01)
		csgo.write_char(glow_object + ((glow_index * 0x38) + 0x24), 1)
		csgo.write_char(glow_object + ((glow_index * 0x38) + 0x25), 0)

		#csgo.write_float(glow_object + ((glow_index * 0x38) + 0x8), 0)
		#csgo.write_float(glow_object + ((glow_index * 0x38) + 0xC), 2)
		#csgo.write_float(glow_object + ((glow_index * 0x38) + 0x10), 1.7)
		#for k in range(0x20, 0x40):
		#csgo.write_char(glow_object + ((glow_index * 0x38) + k), 1)
			#csgo.write_char(glow_object + ((glow_index * 0x38) + 0x20), 1)
			#csgo.write_char(glow_object + ((glow_index * 0x38) + 0x21), 1)
		#csgo.write_char(glow_object + ((glow_index * 0x38) + 0x25), 0)
		#csgo.write_char(glow_object + ((glow_index * 0x38) + 0x25), 0)