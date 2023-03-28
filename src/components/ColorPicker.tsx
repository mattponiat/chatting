import * as React from "react";
//Color slider
import { useColorSlider } from "@react-aria/color";
import { type Color, useColorSliderState } from "@react-stately/color";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useLocale } from "@react-aria/i18n";
import { useFocusRing } from "@react-aria/focus";

const TRACK_THICKNESS = 28;
const THUMB_SIZE = 20;

type ColorPickerProps = {
  channel:
    | "hue"
    | "saturation"
    | "brightness"
    | "lightness"
    | "red"
    | "green"
    | "blue"
    | "alpha";
  defaultValue: string | Color;
  value?: Color;
  onChangeEnd?: (value: Color) => void;
  onChange: (e: Color) => void;
  label?: string;
};

const ColorPicker = (props: ColorPickerProps) => {
  const { locale } = useLocale();
  const state = useColorSliderState({ ...props, locale });
  const trackRef = React.useRef(null);
  const inputRef = React.useRef(null);

  // Default label to the channel name in the current locale
  const label =
    props.label || state.value.getChannelName(props.channel, locale);

  const { trackProps, thumbProps, inputProps, labelProps, outputProps } =
    useColorSlider(
      {
        ...props,
        label,
        trackRef,
        inputRef,
      },
      state
    );

  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex self-stretch">
        <label {...labelProps} className="text-neutral-content">
          {label}
        </label>
        <output
          {...outputProps}
          className="flex-shrink-0 flex-grow basis-auto text-end text-neutral-content"
        >
          {state.value.formatChannelValue(props.channel, locale)}
        </output>
      </div>
      <div
        {...trackProps}
        ref={trackRef}
        style={{
          ...trackProps.style,
          height: TRACK_THICKNESS,
        }}
        className="w-full rounded-lg"
      >
        <div
          {...thumbProps}
          style={{
            ...thumbProps.style,
            top: TRACK_THICKNESS / 2,
            width: isFocusVisible ? TRACK_THICKNESS + 4 : THUMB_SIZE,
            height: isFocusVisible ? TRACK_THICKNESS + 4 : THUMB_SIZE,
            background: state.getDisplayColor().toString("css"),
          }}
          className="box-border rounded-full border-2 border-black shadow-[0_0_0_0.5px_black]"
        >
          <VisuallyHidden>
            <input ref={inputRef} {...inputProps} {...focusProps} />
          </VisuallyHidden>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
