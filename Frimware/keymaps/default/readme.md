# trashpad

![trashpad]

A handbuilt 9-key macropad with a rotary encoder and 0.91" OLED display. Built around the Seeed XIAO RP2040.

* Keyboard Maintainer: [Moksha Kumbhaj](https://github.com/Mokxsh404)
* Hardware Supported: Custom PCB (XIAO RP2040), EC11 rotary encoder, 0.91" I2C OLED (SSD1306)
* Hardware Availability: coming soon

Make example for this keyboard (after setting up your build environment):

    make trashpad:default

Flashing example for this keyboard:

    make trashpad:default:flash

See the [build environment setup](https://docs.qmk.fm/#/getting_started_build_tools) and the [make instructions](https://docs.qmk.fm/#/getting_started_make_guide) for more information. Brand new to QMK? Start with our [Complete Newbs Guide](https://docs.qmk.fm/#/newbs).

## Bootloader

Enter the bootloader in 3 ways:

* **Bootmagic reset**: Hold down the key at (0,0) in the matrix (usually the top left key) and plug in the keyboard
* **Physical reset button**: Hold the BOOT button on the XIAO RP2040, then plug in via USB
* **Keycode in layout**: Press the key mapped to `QK_BOOT` if it is available