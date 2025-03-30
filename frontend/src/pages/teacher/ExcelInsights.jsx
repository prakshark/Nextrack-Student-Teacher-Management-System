import { useState, useRef } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ExcelInsights = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [insights, setInsights] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const insightsRef = useRef(null);

  const analyzeData = (data) => {
    const columns = Object.keys(data[0]);
    const analysis = {};

    columns.forEach(column => {
      const values = data.map(row => row[column]);
      const numericValues = values.filter(value => !isNaN(value) && value !== '');

      if (numericValues.length > 0) {
        // Calculate statistics for numeric columns
        const sum = numericValues.reduce((a, b) => a + parseFloat(b), 0);
        const avg = sum / numericValues.length;
        const max = Math.max(...numericValues);
        const min = Math.min(...numericValues);
        const sortedValues = [...numericValues].sort((a, b) => a - b);
        const median = sortedValues[Math.floor(sortedValues.length / 2)];

        // Prepare data for chart
        const chartData = [
          { name: 'Maximum', value: max },
          { name: 'Minimum', value: min },
          { name: 'Average', value: avg },
          { name: 'Median', value: median }
        ];

        analysis[column] = {
          type: 'numeric',
          statistics: {
            max,
            min,
            average: avg.toFixed(2),
            median: median.toFixed(2)
          },
          chartData
        };
      } else {
        // For non-numeric columns, calculate frequency distribution
        const frequency = values.reduce((acc, value) => {
          acc[value] = (acc[value] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.entries(frequency).map(([name, value]) => ({
          name,
          value
        }));

        analysis[column] = {
          type: 'categorical',
          frequency,
          chartData
        };
      }
    });

    return analysis;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);

          if (data.length === 0) {
            throw new Error('The Excel file is empty');
          }

          const analysisResults = analyzeData(data);
          setInsights(analysisResults);
          setLoading(false);
        } catch (error) {
          setError('Error processing Excel file: ' + error.message);
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setError('Error reading file');
        setLoading(false);
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      setError('Error processing file: ' + error.message);
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!insights || !insightsRef.current) return;

    setPdfLoading(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Add title
      pdf.setFontSize(20);
      pdf.text('Excel Insights Report', 20, 20);
      pdf.setFontSize(12);
      
      let currentY = 40;
      
      // Convert each insight card to canvas and add to PDF
      for (const [column, analysis] of Object.entries(insights)) {
        const card = insightsRef.current.querySelector(`[data-column="${column}"]`);
        if (!card) continue;

        const canvas = await html2canvas(card, {
          scale: 2,
          logging: false,
          useCORS: true
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 170;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Check if we need a new page
        if (currentY + imgHeight > pageHeight - 20) {
          pdf.addPage();
          currentY = 20;
        }
        
        pdf.addImage(imgData, 'PNG', 20, currentY, imgWidth, imgHeight);
        currentY += imgHeight + 20;
      }
      
      pdf.save('excel-insights-report.pdf');
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF. Please try again.');
    }
    setPdfLoading(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ mb: 3 }}
      >
        <Typography variant="h4">
          Generate Excel Insights
        </Typography>
        {insights && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleDownloadPDF}
            disabled={pdfLoading}
          >
            {pdfLoading ? <CircularProgress size={24} /> : 'Download PDF Report'}
          </Button>
        )}
      </Stack>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 2 }}
          >
            Upload Excel File
            <input
              type="file"
              hidden
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
            />
          </Button>
          {file && (
            <Typography variant="body1" color="text.secondary">
              Selected file: {file.name}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!file || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Generate Insights'}
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <div ref={insightsRef}>
        {insights && (
          <Grid container spacing={4}>
            {Object.entries(insights).map(([column, analysis]) => (
              <Grid item xs={12} key={column}>
                <Card data-column={column}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {column}
                    </Typography>

                    {analysis.type === 'numeric' && (
                      <>
                        <TableContainer component={Paper} sx={{ mb: 2 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Metric</TableCell>
                                <TableCell align="right">Value</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Object.entries(analysis.statistics).map(([metric, value]) => (
                                <TableRow key={metric}>
                                  <TableCell component="th" scope="row">
                                    {metric.charAt(0).toUpperCase() + metric.slice(1)}
                                  </TableCell>
                                  <TableCell align="right">{value}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>

                        <Box sx={{ height: 300 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analysis.chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </Box>
                      </>
                    )}

                    {analysis.type === 'categorical' && (
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analysis.chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    </Container>
  );
};

export default ExcelInsights; 