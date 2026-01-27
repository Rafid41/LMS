from django.core.management.base import BaseCommand
from App_Admin_Content_Management.models import Subject_Tag
from django.utils.text import slugify

class Command(BaseCommand):
    help = 'Seeds the database with common educational subject tags'

    def handle(self, *args, **kwargs):
        subjects = [
            # Computer Science & Technology
            "Computer Science", "Artificial Intelligence", "Machine Learning", "Data Science", 
            "Web Development", "Mobile App Development", "Cybersecurity", "Blockchain", 
            "Cloud Computing", "DevOps", "Software Engineering", "Game Development",
            "Database Management", "Network Administration", "Internet of Things (IoT)",
            "Computer Graphics", "Human-Computer Interaction", "Algorithm Design",
            
            # Mathematics & Logic
            "Mathematics", "Calculus", "Linear Algebra", "Statistics", "Probability",
            "Discrete Mathematics", "Logic", "Number Theory", "Differential Equations",
            
            # Business & Management
            "Business Administration", "Marketing", "Finance", "Accounting", "Entrepreneurship",
            "Project Management", "Human Resources", "Supply Chain Management", "Business Strategy",
            "Economics", "Digital Marketing", "E-commerce",
            
            # Humanities & Arts
            "Literature", "History", "Philosophy", "Linguistics", "Art History", "Music Theory",
            "Creative Writing", "Journalism", "Languages", "Psychology", "Sociology", 
            "Anthropology", "Political Science",
            
            # Science & Engineering
            "Physics", "Chemistry", "Biology", "Environmental Science", "Astronomy",
            "Mechanical Engineering", "Electrical Engineering", "Civil Engineering",
            "Chemical Engineering", "Biotechnology",
            
            # Personal Development
            "Leadership", "Communication Skills", "Time Management", "Critical Thinking",
            "Public Speaking", "Emotional Intelligence", "Negotiation",
            
            # Health & Medicine
            "Medicine", "Public Health", "Nutrition", "Anatomy", "Nursing", "Pharmacy",
            "Psychiatry", "Fitness & Wellness",
            
            # Design
            "Graphic Design", "UI/UX Design", "Fashion Design", "Interior Design",
            "Product Design", "Animation"
        ]

        created_count = 0
        existing_count = 0

        self.stdout.write("Starting to seed subject tags...")

        for subject_name in subjects:
            slug = slugify(subject_name)
            # Check if tag exists by slug or name to avoid duplicates
            if not Subject_Tag.objects.filter(slug=slug).exists() and not Subject_Tag.objects.filter(name__iexact=subject_name).exists():
                Subject_Tag.objects.create(name=subject_name, slug=slug)
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"Created: {subject_name}"))
            else:
                existing_count += 1
                # self.stdout.write(f"Skipped (already exists): {subject_name}")

        self.stdout.write(self.style.SUCCESS(f"Seeding completed! Created: {created_count}, Skipped: {existing_count}"))
