from fastapi import APIRouter, UploadFile, File, HTTPException
import numpy as np
import cv2
import io
import os
import logging
import traceback
from PIL import Image
import requests
import base64
import json
from typing import Optional
from dotenv import load_dotenv

router = APIRouter()
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Get Gemini API key from environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

async def process_image_for_disease(image_data: bytes, disease_type: str):
    """
    Process the uploaded image for the specific disease type
    """
    try:
        # Convert bytes to numpy array
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Process image based on disease type
        if disease_type == "diabetes":
            return process_diabetes_image(img)
        elif disease_type == "heart":
            return process_heart_image(img)
        elif disease_type == "liver":
            return process_liver_image(img)
        elif disease_type == "lung":
            return process_lung_image(img)
        elif disease_type == "kidney":
            return process_kidney_image(img)
        elif disease_type == "parkinsons":
            return process_parkinsons_image(img)
        elif disease_type == "breast":
            return process_breast_cancer_image(img)
        else:
            return process_general_disease_image(img)
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Image processing error: {str(e)}")

def process_diabetes_image(img):
    """
    Process image for diabetes detection
    For now, we'll use Gemini API for analysis and return a placeholder result
    In a production environment, you would use a specific ML model for this
    """
    # Get detailed analysis from Gemini specifically for diabetes
    analysis = get_gemini_analysis(img, "diabetes", is_specific=True)
    
    # For image uploads, we only return the analysis, not predictions
    return {
        "analysis": analysis
    }

def process_heart_image(img):
    """Process image for heart disease detection"""
    # Placeholder values
    prediction = True
    probability = 0.65
    analysis = get_gemini_analysis(img, "heart disease")
    
    return {
        "prediction": prediction,
        "probability": probability,
        "analysis": analysis
    }

def process_liver_image(img):
    """Process image for liver disease detection"""
    # Placeholder values
    prediction = True
    probability = 0.72
    analysis = get_gemini_analysis(img, "liver disease")
    
    return {
        "prediction": prediction,
        "probability": probability,
        "analysis": analysis
    }

def process_lung_image(img):
    """Process image for lung cancer detection"""
    # Placeholder values
    prediction = False
    probability = 0.15
    analysis = get_gemini_analysis(img, "lung cancer")
    
    return {
        "prediction": prediction,
        "probability": probability,
        "analysis": analysis
    }

def process_kidney_image(img):
    """Process image for chronic kidney disease detection"""
    # Placeholder values
    prediction = True
    probability = 0.83
    analysis = get_gemini_analysis(img, "chronic kidney disease")
    
    return {
        "prediction": prediction,
        "probability": probability,
        "analysis": analysis
    }

def process_parkinsons_image(img):
    """Process image for Parkinson's disease detection"""
    # Placeholder values
    prediction = True
    probability = 0.91
    analysis = get_gemini_analysis(img, "Parkinson's disease")
    
    return {
        "prediction": prediction,
        "probability": probability,
        "analysis": analysis
    }

def process_breast_cancer_image(img):
    """Process image for breast cancer detection"""
    # Placeholder values
    prediction = False
    probability = 0.08
    analysis = get_gemini_analysis(img, "breast cancer")
    
    return {
        "prediction": prediction,
        "probability": probability,
        "analysis": analysis
    }

def process_general_disease_image(img):
    """Process image for general disease detection"""
    # Placeholder values
    disease = "Common Cold"
    probability = 0.75
    description = "The common cold is a viral infection of your nose and throat (upper respiratory tract)."
    precautions = [
        "Rest and stay hydrated",
        "Use over-the-counter medications to manage symptoms",
        "Wash hands frequently",
        "Avoid close contact with others"
    ]
    analysis = get_gemini_analysis(img, "general disease symptoms")
    
    return {
        "prediction": disease,
        "probability": probability,
        "description": description,
        "precautions": precautions,
        "analysis": analysis
    }

def get_gemini_analysis(img, disease_type: str, is_specific: bool = False) -> str:
    """
    Get detailed analysis from Google's Gemini API
    """
    if not GEMINI_API_KEY:
        return "API key not configured. Please set up your Gemini API key to get detailed analysis."
    
    try:
        # Convert image to base64
        _, buffer = cv2.imencode('.jpg', img)
        img_base64 = base64.b64encode(buffer).decode('utf-8')
        
        # Prepare the request for Gemini API
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
        
        prompt_text = ""
        if is_specific and disease_type == "diabetes":
            prompt_text = (
                "Analyze this image for diabetes-related information. "
                "First, determine if this is: (1) a medical image showing physical symptoms of diabetes, "
                "(2) a diabetes report/document, or (3) an unrelated image. "
                
                "If it's a MEDICAL IMAGE showing physical symptoms (like diabetic foot ulcers, retinopathy, etc.):"
                "- Start with 'MEDICAL IMAGE: This shows diabetes-related symptoms'"
                "- Analyze visible symptoms"
                "- Provide severity assessment"
                
                "If it's a DIABETES REPORT/DOCUMENT:"
                "- Start with 'DIABETES REPORT: This is a medical document'"
                "- Extract key metrics (glucose levels, HbA1c, etc.)"
                "- State clearly if diabetes is present based on the report values"
                "- Provide probability percentage if available"
                "- List any concerning values in bullet points"
                
                "If it's an UNRELATED IMAGE:"
                "- Start with 'UNRELATED IMAGE: This image does not show diabetes-related conditions'"
                "- Briefly explain why"
                
                "Format your response with these sections:"
                "1. Classification (what type of image this is)"
                "2. Key Findings (metrics or symptoms)"
                "3. Recommendations"
                
                "Keep your response concise and avoid markdown formatting."
            )
        else:
            prompt_text = f"Analyze this medical image for signs of {disease_type}. Provide a detailed assessment including potential indicators, severity if applicable, and recommendations. Format your response in a clear, structured way suitable for a medical application."
        
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt_text},
                        {
                            "inline_data": {
                                "mime_type": "image/jpeg",
                                "data": img_base64
                            }
                        }
                    ]
                }
            ],
            "generation_config": {
                "temperature": 0.4,
                "top_p": 0.95,
                "max_output_tokens": 800
            }
        }
        
        response = requests.post(url, json=payload)
        
        if response.status_code == 200:
            result = response.json()
            # Extract the text from the response
            if 'candidates' in result and len(result['candidates']) > 0:
                if 'content' in result['candidates'][0] and 'parts' in result['candidates'][0]['content']:
                    for part in result['candidates'][0]['content']['parts']:
                        if 'text' in part:
                            return part['text']
            
            return "Analysis not available"
        else:
            logger.error(f"Gemini API error: {response.status_code} - {response.text}")
            return f"Unable to get analysis. API error: {response.status_code}"
            
    except Exception as e:
        logger.error(f"Error in Gemini analysis: {str(e)}")
        return "Error generating analysis"

@router.post("/{disease_type}")
async def upload_image(disease_type: str, file: UploadFile = File(...)):
    """
    Endpoint to upload and process an image for disease detection
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read file content
        contents = await file.read()
        
        # Process the image
        result = await process_image_for_disease(contents, disease_type)
        
        return result
    
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error processing upload: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error processing upload: {str(e)}")
