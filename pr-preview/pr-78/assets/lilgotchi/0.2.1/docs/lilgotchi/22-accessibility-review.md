# Readable controls and verification

> Verification record. Browser and automated checks are complete for the recorded cases. Physical devices, human screen reader and audio checks, and the broader native zoom review remain open. See the [current status](../implementation-status.md) and [release review](../release-review.md).

Settings and care dialogs use an opaque dark surface, system text at 14px or larger, clear focus and 44px action targets. No status text is placed over the pet. Primary care remains outside the logical display. Enlarged text must grow the frame rather than hide actions.

Review the actual desktop, 390px and 320px views, landscape, enlarged text, keyboard navigation, reduced motion, all three palettes and light outer shell. Measure text contrast separately from looking at the result. Review sound start, mute, resume and persistence with automated audio context tests.

Physical iPhone and Android, a human screen reader session and human audio listening require external verification. Desktop emulation and oscillator assertions are not substitutes. Record each result honestly in the current release review.
