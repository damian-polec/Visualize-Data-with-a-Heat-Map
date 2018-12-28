import React, { Component } from 'react';
import * as d3 from "d3";


class HeatMap extends Component {
    componentDidMount () {
        this.heatMap();
    }

    heatMap () {

        const margin = {left: 100, right: 10, top: 100, bottom: 100}
        const width = 1000 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;
        const color = d3.scaleQuantize()
           .domain(d3.extent(this.props.data, d => d.variance))
           .range(this.props.colors);
        
        const scaleY = d3.scaleBand()
            .domain(this.props.months)
            .range([height, 0]);
        const scaleX = d3.scaleTime()
            .domain(d3.extent(this.props.data, data => data.year))
            .range([0, width]);
        
        const svg = d3.select('#heatMap')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)

        const g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        
        const xAxis = d3.axisBottom(scaleX).tickFormat(d3.format('d')) 
        g.append('g')
            .attr('id', 'x-axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        const yAxis = d3.axisLeft(scaleY).tickSizeOuter(0);
        g.append('g')
            .attr('id', 'y-axis')
            .call(yAxis)

        //Legend
        const thresholdDomain = this.props.colors.map((color, i) => {
            const step = (d3.max(this.props.data, d => d.variance) - d3.min(this.props.data, d => d.variance) + 1.5)/this.props.colors.length;
            return (d3.min(this.props.data, d => d.variance) + (i*step)) 
        })
        const threshold = d3.scaleThreshold()
            .domain(thresholdDomain)
            .range(this.props.colors)
        const legendScale = d3.scaleLinear()
            .domain([d3.min(this.props.data, d => d.variance), d3.max(this.props.data, d => d.variance)])
            .range([0, 400])
        const legendAxisX = d3.axisBottom(legendScale)
            .tickValues(threshold.domain())
            .tickSize(13,0)
            .tickSizeOuter(0)
            .tickFormat(d3.format(".1f"));
        const legend = svg.append('g')
            .attr('id', 'legend')
            .attr('transform', 'translate(' + (width/2) + ', ' + (margin.top/2) + ')');
        legend.call(legendAxisX);
        legend.selectAll('rect')
            .data(threshold.range().map(color => {
                const d =threshold.invertExtent(color)
               if(d[0] === null) d[0] = legendScale.domain()[0];
               if(d[1] === null) d[1] = legendScale.domain()[1];
               return d;
            })).enter().append("rect")
            .attr("height", 10)
            .attr("x", function(d) { return legendScale(d[0]); })
            .attr('y', 0)
            .attr("width", function(d) { return legendScale(d[1]) - legendScale(d[0]); })
            .attr("fill", function(d) { return threshold(d[0]); });
        

        //HeatMap
        const rects = g.selectAll('rect').data(this.props.data);

        const rect = rects.enter()
            .append('rect')
            .attr('class', 'cell')
            .attr('data-month', d => d.month)
            .attr('data-year', d => d.year)
            .attr('data-temp', d => d.variance)
            .attr('x', d => scaleX(d.year))
            .attr('y', d => scaleY(this.props.months[d.month]))
            .attr('width', width/(this.props.data.length / 12))
            .attr('height', scaleY.bandwidth())
            .attr('fill', d => color(d.variance))
            
        
        //Tooltip
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .attr('id', 'tooltip')
            .style('opacity', '0')

        rect.on('mouseover', d => {
                tooltip.transition()
                    .duration(10)
                    .style('opacity', .9);
                tooltip.html(
                    `
                    <p>${d.month} ${d.year}</p>
                    <p>Temperature: ${d.variance}</p>
                    `
                ).attr('data-year', d.year)
                .style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY) + 'px')
            })
            rect.on('mouseout', d => {
                tooltip.transition()
                    .duration(10)
                    .style('opacity', 0)
            })
        
    }
    render(){
        return <div id='heatMap'></div>
    }
}

export default HeatMap;