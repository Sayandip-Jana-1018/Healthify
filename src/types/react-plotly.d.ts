declare module 'react-plotly.js' {
  import * as Plotly from 'plotly.js';
  import * as React from 'react';

  interface PlotParams {
    data?: Plotly.Data[];
    layout?: Partial<Plotly.Layout>;
    frames?: Plotly.Frame[];
    config?: Partial<Plotly.Config>;
    style?: React.CSSProperties;
    className?: string;
    useResizeHandler?: boolean;
    debug?: boolean;
    onInitialized?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onUpdate?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onPurge?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onError?: (err: Error) => void;
    onAfterPlot?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onRedraw?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onAutosize?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onButtonClicked?: (figure: Plotly.Figure, graphDiv: HTMLElement, button: Plotly.ButtonClickEvent) => void;
    onClickAnnotation?: (figure: Plotly.Figure, graphDiv: HTMLElement, annotation: Plotly.ClickAnnotationEvent) => void;
    onClick?: (figure: Plotly.Figure, graphDiv: HTMLElement, event: Plotly.PlotMouseEvent) => void;
    onDoubleClick?: (figure: Plotly.Figure, graphDiv: HTMLElement, event: Plotly.PlotMouseEvent) => void;
    onDeselect?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onFramework?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onHover?: (figure: Plotly.Figure, graphDiv: HTMLElement, event: Plotly.PlotMouseEvent) => void;
    onLegendClick?: (figure: Plotly.Figure, graphDiv: HTMLElement, event: Plotly.LegendClickEvent) => void;
    onLegendDoubleClick?: (figure: Plotly.Figure, graphDiv: HTMLElement, event: Plotly.LegendClickEvent) => void;
    onRelayout?: (figure: Plotly.Figure, graphDiv: HTMLElement, event: Plotly.PlotRelayoutEvent) => void;
    onRestyle?: (figure: Plotly.Figure, graphDiv: HTMLElement, event: Plotly.PlotRestyleEvent) => void;
    onRedraw?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onSelected?: (figure: Plotly.Figure, graphDiv: HTMLElement, event: Plotly.PlotSelectionEvent) => void;
    onSelecting?: (figure: Plotly.Figure, graphDiv: HTMLElement, event: Plotly.PlotSelectionEvent) => void;
    onSliderChange?: (figure: Plotly.Figure, graphDiv: HTMLElement, event: Plotly.SliderChangeEvent) => void;
    onSliderEnd?: (figure: Plotly.Figure, graphDiv: HTMLElement, event: Plotly.SliderEndEvent) => void;
    onSliderStart?: (figure: Plotly.Figure, graphDiv: HTMLElement, event: Plotly.SliderStartEvent) => void;
    onTransitioning?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onTransitionInterrupted?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onUnhover?: (figure: Plotly.Figure, graphDiv: HTMLElement, event: Plotly.PlotMouseEvent) => void;
    onWebGlContextLost?: (figure: Plotly.Figure, graphDiv: HTMLElement, event: WebGLContextEvent) => void;
    onAnimated?: (figure: Plotly.Figure, graphDiv: HTMLElement, animation: Plotly.AnimationEvent) => void;
    onAnimatingFrame?: (figure: Plotly.Figure, graphDiv: HTMLElement, frame: Plotly.AnimationEvent) => void;
    onAnimationInterrupted?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onAddTrace?: (figure: Plotly.Figure, graphDiv: HTMLElement, trace: Plotly.AddTraceEvent) => void;
    onDeleteTrace?: (figure: Plotly.Figure, graphDiv: HTMLElement, trace: Plotly.DeleteTraceEvent) => void;
  }

  class Plot extends React.Component<PlotParams> {}
  export default Plot;
}
