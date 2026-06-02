"""
Report routes - financial report generation and export
Protected: All routes require authentication
"""
from fastapi import APIRouter, Depends, Query, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from datetime import date
from io import BytesIO

from app.db.database import get_db
from app.models.user import User
from app.schemas.report import ReportRequest, QuickReportRequest, ReportResponse
from app.services.reports.report_service import ReportService
from app.core.security import get_current_user

# Create router instance
router = APIRouter()

@router.post("/generate", response_model=dict)
def generate_report(
    request: ReportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Generate comprehensive financial report for custom date range
    """
    report = ReportService.generate_report(
        user_id=current_user.id,
        start_date=request.start_date,
        end_date=request.end_date,
        db=db
    )
    return report

@router.get("/quick/{period}", response_model=dict)
def generate_quick_report(
    period: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Generate report for predefined period
    
    Periods: this_month, last_month, this_year, last_year, last_30_days, last_90_days
    """
    report = ReportService.get_quick_report(
        user_id=current_user.id,
        period=period,
        db=db
    )
    return report

@router.post("/export/csv")
def export_csv(
    request: ReportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Export report as CSV file"""
    # Generate report
    report = ReportService.generate_report(
        user_id=current_user.id,
        start_date=request.start_date,
        end_date=request.end_date,
        db=db
    )
    
    # Convert to CSV
    csv_content = ReportService.export_to_csv(report)
    
    # Create filename
    filename = f"financial_report_{request.start_date}_{request.end_date}.csv"
    
    # Return as downloadable file
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )

@router.get("/export/csv/quick/{period}")
def export_csv_quick(
    period: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Export quick report as CSV file"""
    # Generate report
    report = ReportService.get_quick_report(
        user_id=current_user.id,
        period=period,
        db=db
    )
    
    # Convert to CSV
    csv_content = ReportService.export_to_csv(report)
    
    # Create filename
    filename = f"financial_report_{period}.csv"
    
    # Return as downloadable file
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )

@router.post("/export/pdf")
def export_pdf(
    request: ReportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Export report as PDF file"""
    # Generate report
    report = ReportService.generate_report(
        user_id=current_user.id,
        start_date=request.start_date,
        end_date=request.end_date,
        db=db
    )
    
    # Convert to PDF
    pdf_content = ReportService.export_to_pdf(report)
    
    # Create filename
    filename = f"financial_report_{request.start_date}_{request.end_date}.pdf"
    
    # Return as downloadable file
    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )

@router.get("/export/pdf/quick/{period}")
def export_pdf_quick(
    period: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Export quick report as PDF file"""
    # Generate report
    report = ReportService.get_quick_report(
        user_id=current_user.id,
        period=period,
        db=db
    )
    
    # Convert to PDF
    pdf_content = ReportService.export_to_pdf(report)
    
    # Create filename
    filename = f"financial_report_{period}.pdf"
    
    # Return as downloadable file
    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )

@router.post("/export/excel")
def export_excel(
    request: ReportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Export report as Excel file"""
    # Generate report
    report = ReportService.generate_report(
        user_id=current_user.id,
        start_date=request.start_date,
        end_date=request.end_date,
        db=db
    )
    
    # Convert to Excel
    excel_content = ReportService.export_to_excel(report)
    
    # Create filename
    filename = f"financial_report_{request.start_date}_{request.end_date}.xlsx"
    
    # Return as downloadable file
    return Response(
        content=excel_content,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )

@router.get("/export/excel/quick/{period}")
def export_excel_quick(
    period: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Export quick report as Excel file"""
    # Generate report
    report = ReportService.get_quick_report(
        user_id=current_user.id,
        period=period,
        db=db
    )
    
    # Convert to Excel
    excel_content = ReportService.export_to_excel(report)
    
    # Create filename
    filename = f"financial_report_{period}.xlsx"
    
    # Return as downloadable file
    return Response(
        content=excel_content,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )
