#!/bin/sh
# Runs PrusaSlicer headless inside the Docker image.
# Some PrusaSlicer CLI paths initialize wxWidgets and fail without a display,
# so slicing goes through a throwaway virtual X server.
exec xvfb-run -a /usr/bin/prusa-slicer "$@"
