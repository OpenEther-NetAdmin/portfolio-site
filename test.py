#!/usr/bin/env python3
"""
Qdrant Test Script
Tests vector database operations with sample data
"""
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct


def main():
    """Main function to test Qdrant operations"""
    try:
        # Connect with timeout
        client = QdrantClient(url="http://localhost:6333", timeout=30.0)
        
        # Verify connection first
        try:
            client.ping()
            print("✓ Connected to Qdrant server")
        except Exception as e:
            print(f"❌ Error: Cannot connect to Qdrant server: {e}")
            return 1
        
        # Clean up existing collection if it exists
        try:
            client.delete_collection("test_collection")
            print up existing collection("✓ Cleaned")
        except Exception:
            # Collection doesn't exist, that's fine
            pass
        
        # Create collection
        client.create_collection(
            collection_name="test_collection",
            vectors_config=VectorParams(size=4, distance=Distance.DOT),
        )
        print("✓ Created collection 'test_collection'")
        
        # Insert points
        operation_info = client.upsert(
            collection_name="test_collection",
            wait=True,
            points=[
                PointStruct(id=1, vector=[0.05, 0.61, 0.76, 0.74], payload={"city": "Berlin"}),
                PointStruct(id=2, vector=[0.19, 0.81, 0.75, 0.11], payload={"city": "London"}),
                PointStruct(id=3, vector=[0.36, 0.55, 0.47, 0.94], payload={"city": "Moscow"}),
                PointStruct(id=4, vector=[0.18, 0.01, 0.85, 0.80], payload={"city": "New York"}),
                PointStruct(id=5, vector=[0.24, 0.18, 0.22, 0.44], payload={"city": "Beijing"}),
                PointStruct(id=6, vector=[0.35, 0.08, 0.11, 0.44], payload={"city": "Mumbai"}),
            ],
        )
        print(f"✓ Inserted 6 points: {operation_info}")
        
        # Verify points were inserted
        count = client.count(
            collection_name="test_collection",
        )
        print(f"✓ Collection has {count.points} points")
        
        print("\n✅ All tests passed!")
        return 0
        
    except ConnectionError as e:
        print(f"❌ Connection Error: {e}")
        return 1
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1


if __name__ == "__main__":
    import sys
    sys.exit(main())
