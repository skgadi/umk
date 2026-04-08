import os
Import("env")

# The path to the final merged binary
OUTPUT_BIN = os.path.join("$BUILD_DIR", "merged_firmware.bin")

def merge_binaries(source, target, env):
    # Retrieve project settings
    board = env.BoardConfig()
    mcu = board.get("build.mcu", "esp32")
    flash_size = board.get("upload.flash_size", "4MB")
    
    # 1. Get framework images (bootloader, partitions, boot_app0)
    # This automatically finds paths like ~/.platformio/packages/.../boot_app0.bin
    flash_images = env.Flatten(env.get("FLASH_EXTRA_IMAGES", []))
    
    # 2. Add the main firmware and its typical offset (0x10000)
    app_offset = "0x10000"
    flash_images.extend([app_offset, str(target[0])])

    # Construct the esptool merge command
    cmd = [
        "$PYTHONEXE", "$OBJCOPY", 
        "--chip", mcu, 
        "merge_bin", 
        "-o", OUTPUT_BIN, 
        "--flash_mode", "dio", 
        "--flash_size", flash_size,
    ]
    
    # Append the offset/file pairs
    cmd.extend(flash_images)
    
    print(f"\n--- Creating merged binary: {OUTPUT_BIN} ---")
    env.Execute(" ".join(cmd))

# Hook the script to run AFTER the main firmware.bin is created
env.AddPostAction("$BUILD_DIR/${PROGNAME}.bin", merge_binaries)
